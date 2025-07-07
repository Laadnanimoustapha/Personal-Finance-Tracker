import mysql.connector

# Connect to your finance database
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="your_mysql_password",  # Replace this!
    database="finance_db"
)

cursor = conn.cursor(dictionary=True)
cursor.execute("SELECT * FROM transactions")

transactions = cursor.fetchall()
conn.close()

# Analyze spending per category
category_totals = {}
for tx in transactions:
    if tx['type'] == 'expense':
        cat = tx['category']
        amt = float(tx['amount'])
        category_totals[cat] = category_totals.get(cat, 0) + amt

# Show top 3 spending categories
top = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)[:3]

print("Top Spending Categories:")
for cat, total in top:
    print(f"{cat}: ${total:.2f}")

# Suggest saving
print("\n💡 AI Suggestion:")
print(f"Try to reduce spending on '{top[0][0]}'. You spent ${top[0][1]:.2f} there.")
