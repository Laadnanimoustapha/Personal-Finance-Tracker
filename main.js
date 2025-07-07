// Initialize the app
        let transactions = [];
        
        // Set today's date as default
        document.getElementById('date').valueAsDate = new Date();

        // Form submission handler
        document.getElementById('transaction-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const type = document.getElementById('type').value;
            const category = document.getElementById('category').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const date = document.getElementById('date').value;
            const note = document.getElementById('note').value;
            
            // Add transaction to array
            transactions.push({
                id: Date.now(),
                type,
                category,
                amount,
                date,
                note
            });
            
            // Update UI
            updateTransactionTable();
            updateBalanceCards();
            
            // Reset form
            this.reset();
            document.getElementById('date').valueAsDate = new Date();
            
            // Show success feedback
            showNotification('Transaction added successfully!', 'success');
        });

        function updateTransactionTable() {
            const tbody = document.getElementById('transactions-tbody');
            const emptyState = document.getElementById('empty-state');
            
            if (transactions.length === 0) {
                tbody.innerHTML = '';
                emptyState.style.display = 'block';
                return;
            }
            
            emptyState.style.display = 'none';
            
            tbody.innerHTML = transactions.map(transaction => `
                <tr>
                    <td>
                        <span class="type-badge type-${transaction.type}">
                            ${transaction.type === 'income' ? '💰' : '💸'} ${transaction.type}
                        </span>
                    </td>
                    <td>${transaction.category}</td>
                    <td style="font-weight: 600; color: ${transaction.type === 'income' ? '#28a745' : '#dc3545'}">
                        ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
                    </td>
                    <td>${new Date(transaction.date).toLocaleDateString()}</td>
                    <td>${transaction.note || '-'}</td>
                </tr>
            `).join('');
        }

        function updateBalanceCards() {
            const totalIncome = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const totalExpenses = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const totalBalance = totalIncome - totalExpenses;
            
            document.getElementById('total-balance').textContent = `$${totalBalance.toFixed(2)}`;
            document.getElementById('total-income').textContent = `$${totalIncome.toFixed(2)}`;
            document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
        }

        function showNotification(message, type) {
            // Create notification element
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background: ${type === 'success' ? '#28a745' : '#dc3545'};
                color: white;
                border-radius: 10px;
                font-weight: 600;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Analyze button handler
        document.getElementById('analyze-btn').addEventListener('click', function() {
            if (transactions.length === 0) {
                showNotification('Add some transactions first!', 'error');
                return;
            }
            
            // Simple analysis
            const categories = {};
            transactions.forEach(t => {
                if (t.type === 'expense') {
                    categories[t.category] = (categories[t.category] || 0) + t.amount;
                }
            });
            
            const topCategory = Object.entries(categories)
                .sort(([,a], [,b]) => b - a)[0];
            
            if (topCategory) {
                showNotification(`Top spending category: ${topCategory[0]} ($${topCategory[1].toFixed(2)})`, 'success');
            }
        });

        // Export button handler
        document.getElementById('export-btn').addEventListener('click', function() {
            if (transactions.length === 0) {
                showNotification('No transactions to export!', 'error');
                return;
            }
            
            const csvContent = "data:text/csv;charset=utf-8," + 
                "Type,Category,Amount,Date,Note\n" +
                transactions.map(t => `${t.type},${t.category},${t.amount},${t.date},"${t.note}"`).join('\n');
            
            const link = document.createElement('a');
            link.setAttribute('href', encodeURI(csvContent));
            link.setAttribute('download', 'transactions.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Transactions exported successfully!', 'success');
        });

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);