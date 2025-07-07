import mysql.connector
import csv
from datetime import datetime

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="your_mysql_password",  # Replace with your real password
    database="finance_db"
)
cursor = conn.cursor()

# Fetch transactions
cursor.execute("SELECT type, category, amount, date, note FROM transactions")
rows = cursor.fetchall()

# Filename with current date
filename = f"finance_report_{datetime.now().strftime('%Y-%m-%d')}.csv"

# Write to CSV
with open(filename, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['Type', 'Category', 'Amount', 'Date', 'Note'])  # Header
    writer.writerows(rows)

print(f"✅ Report exported: {filename}")

cursor.close()
conn.close()
