import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';

class ReportAnalysisScreen extends StatefulWidget {
  @override
  _ReportAnalysisScreenState createState() => _ReportAnalysisScreenState();
}
class _ReportAnalysisScreenState extends State<ReportAnalysisScreen> {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  DateTime? startDate;
  DateTime? endDate;
  bool _alertShown = false;

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: _auth.authStateChanges(), // Listen for auth state changes
      builder: (context, authSnapshot) {
        if (authSnapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        }

        if (!authSnapshot.hasData) {
          return Center(child: Text('User is not logged in.'));
        }

        String userId = authSnapshot.data!.email!.split('@')[0];

        return Scaffold(
          appBar: AppBar(
            title: Text('Report & Analysis', style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.w600)),
            backgroundColor: Color(0xFFB2DFDB),
            elevation: 4,
          ),
          body: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    ElevatedButton(
                      onPressed: () => _selectStartDate(context),
                      child: Text(startDate == null ? 'Select Start Date' : DateFormat('yyyy-MM-dd').format(startDate!)),
                    ),
                    ElevatedButton(
                      onPressed: () => _selectEndDate(context),
                      child: Text(endDate == null ? 'Select End Date' : DateFormat('yyyy-MM-dd').format(endDate!)),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: StreamBuilder<QuerySnapshot>(
                  stream: FirebaseFirestore.instance
                      .collection('transactions')
                      .doc(userId)
                      .collection('userTransactions')
                      .snapshots(),
                  builder: (context, snapshot) {
                    if (snapshot.hasError) {
                      return Center(child: Text('Error fetching transactions: ${snapshot.error}'));
                    }

                    if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                      return Center(child: Text('No transactions found.'));
                    }

                    final transactions = snapshot.data!.docs;
                    double totalIncome = 0;
                    double totalExpense = 0;

                    List<dynamic> filteredTransactions = [];

                    for (var transaction in transactions) {
                      final data = transaction.data() as Map<String, dynamic>;

                      // Check if 'date' exists and is of type Timestamp
                      if (data.containsKey('date') && data['date'] != null && data['date'] is Timestamp) {
                        DateTime transactionDate = (data['date'] as Timestamp).toDate();

                        // Check if transaction date is within the selected range
                        if ((startDate == null || transactionDate.isAfter(startDate!)) &&
                            (endDate == null || transactionDate.isBefore(endDate!.add(Duration(days: 1))))) {
                          double amount = (data['amount'] is String)
                              ? double.tryParse(data['amount']) ?? 0.0
                              : (data['amount'] as num).toDouble();

                          filteredTransactions.add(data); // Add to filtered list

                          if (data['type'] == 'Income') {
                            totalIncome += amount;
                          } else if (data['type'] == 'Expense') {
                            totalExpense += amount;
                          }
                        }
                      } else {
                        // Handle the case where 'date' is null or missing
                        print('Transaction missing date field: $data');
                      }
                    }


                    if (filteredTransactions.isEmpty) {
                      return Center(child: Text('No transactions found for the selected date range.'));
                    }

                    if (totalExpense > totalIncome && !_alertShown) {
                      _alertShown = true;
                      WidgetsBinding.instance.addPostFrameCallback((_) {
                        _showAlertDialog(context);
                      });
                    }

                    return Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: [
                          Text(
                            'Income vs. Expense',
                            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 20),
                          Expanded(
                            child: PieChart(
                              PieChartData(
                                sections: [
                                  PieChartSectionData(
                                    color: Colors.green,
                                    value: totalIncome,
                                    title: totalIncome > 0 ? 'Income' : 'No Income',
                                    radius: 60,
                                    titleStyle: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                  ),
                                  PieChartSectionData(
                                    color: Colors.red,
                                    value: totalExpense,
                                    title: totalExpense > 0 ? 'Expense' : 'No Expenses',
                                    radius: 60,
                                    titleStyle: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                  ),
                                ],
                                borderData: FlBorderData(show: true),
                                sectionsSpace: 0,
                                centerSpaceRadius: 40,
                              ),
                            ),
                          ),
                          SizedBox(height: 20),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              Column(
                                children: [
                                  Text('Total Income'),
                                  Text(
                                    '${totalIncome.toStringAsFixed(2)}',
                                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.green),
                                  ),
                                ],
                              ),
                              Column(
                                children: [
                                  Text('Total Expense'),
                                  Text(
                                    '${totalExpense.toStringAsFixed(2)}',
                                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.red),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          SizedBox(height: 20),
                          ElevatedButton(
                            onPressed: () {
                              _showTransactionsDialog(filteredTransactions, startDate, endDate);
                            },
                            child: Text('View Transactions'),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _selectStartDate(BuildContext context) async {
    DateTime? selectedDate = await showDatePicker(
      context: context,
      initialDate: startDate ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    if (selectedDate != null) {
      setState(() {
        startDate = selectedDate;
        _alertShown = false;  // Reset alert status when dates change
      });
    }
  }

  Future<void> _selectEndDate(BuildContext context) async {
    DateTime? selectedDate = await showDatePicker(
      context: context,
      initialDate: endDate ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    if (selectedDate != null) {
      setState(() {
        endDate = selectedDate;
        _alertShown = false;  // Reset alert status when dates change
      });
    }
  }

  void _showAlertDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Warning!'),
          content: Text('Your total expenses exceed your total income.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
                _alertShown = false; // After the alert is closed, reset the flag
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );
  }

  void _showTransactionsDialog(List<dynamic> transactions, DateTime? startDate, DateTime? endDate) {
    List<Widget> transactionWidgets = [];

    for (var transaction in transactions) {
      DateTime transactionDate = (transaction['date'] as Timestamp).toDate();

      // Display transaction details
      transactionWidgets.add(
        ListTile(
          title: Text('${transaction['type']}: ${transaction['amount']}'), // No dollar symbol
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Category: ${transaction['category']}'),
              Text('Notes: ${transaction['notes']}'),
              Text('Date: ${DateFormat('yyyy-MM-dd').format(transactionDate)}'), // Display the date
            ],
          ),
        ),
      );
    }

    // Show dialog with the transactions
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Transactions from ${startDate != null ? DateFormat('yyyy-MM-dd').format(startDate) : 'N/A'} to ${endDate != null ? DateFormat('yyyy-MM-dd').format(endDate) : 'N/A'}'),
          content: transactionWidgets.isNotEmpty
              ? SingleChildScrollView(child: Column(children: transactionWidgets))
              : Text('No transactions found within selected dates.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: Text('Close'),
            ),
          ],
        );
      },
    );
  }
}
