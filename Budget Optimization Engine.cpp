#include <iostream>
#include <fstream>
#include <sstream>
#include <map>
#include <iomanip>
#include <set>
#include <ctime>
using namespace std;

// Mark these as fixed (not to be optimized)
set<string> fixedCategories = {"Rent", "Utilities", "Insurance", "Mortgage"};

string getMonth(const string& date) {
    return date.substr(0, 7); // e.g. 2025-06
}

int main() {
    ifstream file("transactions.csv");
    if (!file.is_open()) {
        cerr << "❌ Error: Could not open transactions.csv" << endl;
        return 1;
    }

    string line;
    getline(file, line); // skip header

    map<string, double> categoryTotals;
    map<string, int> categoryCounts;
    map<string, map<string, double>> monthlyByCategory;
    map<string, double> monthlyTotal;
    int expenseCount = 0;
    double totalSpent = 0.0;

    while (getline(file, line)) {
        stringstream ss(line);
        string type, category, amountStr, date, note;
        getline(ss, type, ',');
        getline(ss, category, ',');
        getline(ss, amountStr, ',');
        getline(ss, date, ',');
        getline(ss, note, ',');

        if (type == "expense") {
            double amount = stod(amountStr);
            string month = getMonth(date);

            categoryTotals[category] += amount;
            categoryCounts[category]++;
            monthlyByCategory[month][category] += amount;
            monthlyTotal[month] += amount;

            totalSpent += amount;
            expenseCount++;
        }
    }

    ofstream report("budget_report.txt");
    report << "📊 AI-Powered Budget Optimization Report\n";
    report << "Generated on: " << __DATE__ << " " << __TIME__ << "\n\n";

    report << "🧾 Total Expense Transactions: " << expenseCount << "\n";
    report << fixed << setprecision(2);
    report << "💸 Total Spent: $" << totalSpent << "\n\n";

    report << "📅 Monthly Spending:\n";
    for (auto& [month, total] : monthlyTotal) {
        report << "  - " << month << ": $" << total << "\n";
    }

    report << "\n📂 Category Breakdown:\n";
    for (auto& [cat, total] : categoryTotals) {
        double avg = total / categoryCounts[cat];
        bool isFixed = fixedCategories.count(cat) > 0;
        double suggestion = isFixed ? total : total * 0.85;

        report << "  • " << cat << ": Total $" << total
               << " | Avg $" << avg
               << (isFixed ? " | Fixed\n" :
                   " | Suggested budget $" + to_string(suggestion).substr(0, 6) + "\n");
    }

    report << "\n⚠️ Overspending Alerts:\n";
    for (auto& [month, cats] : monthlyByCategory) {
        for (auto& [cat, amt] : cats) {
            double avg = categoryTotals[cat] / categoryCounts[cat];
            if (amt > avg * 1.2) {
                report << "  - " << month << ": Overspent on " << cat
                       << " ($" << amt << " > avg $" << avg << ")\n";
            }
        }
    }

    report << "\n✅ Optimization complete. Save more next month!\n";
    report.close();

    cout << "✅ Budget report saved to 'budget_report.txt'\n";
    return 0;
}
