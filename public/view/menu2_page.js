import { root } from "./elements.js";
import { currentUser } from "../controller/firebase_auth.js";
import { protectedView } from "./protected_view.js";

// Import Chart.js
// Assuming Chart.js is available
// import Chart from 'chart.js/auto';

export async function Menu2PageView() {
    if (!currentUser) {
        root.innerHTML = await protectedView();
        return;
    }

    // Dynamic content for Budget Planner and Savings Tracker
    root.innerHTML = `
        <div class="container mt-4">
            <h1 class="text-center">Budget Planner & Insights</h1>

            <!-- Savings Goal -->
            <div class="savings-section my-4 p-3 bg-light shadow-sm rounded">
                <h3>Savings Goal</h3>
                <div>
                    <label for="savings-goal">Enter your savings goal:</label>
                    <input type="number" id="savings-goal" class="form-control" placeholder="e.g., 1000">
                </div>
                <div class="mt-3">
                    <h5>Progress:</h5>
                    <div class="progress" style="height: 20px;">
                        <div id="savings-progress-bar" class="progress-bar" style="width: 0%;" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            </div>

            <!-- Budget Section -->
            <div class="budget-section my-4 p-3 bg-light shadow-sm rounded">
                <h3>Set Your Monthly Budget</h3>
                <form id="budget-form" class="row g-3">
                    <div class="col-md-6">
                        <label for="category" class="form-label">Category</label>
                        <input type="text" id="category" class="form-control" placeholder="e.g., Rent">
                    </div>
                    <div class="col-md-6">
                        <label for="amount" class="form-label">Amount</label>
                        <input type="number" id="amount" class="form-control" placeholder="e.g., 500">
                    </div>
                    <div class="col-12 text-end">
                        <button type="submit" class="btn btn-primary">Add Expense</button>
                    </div>
                </form>
            </div>

            <!-- Summary Section -->
            <div class="summary-section my-4 p-3 bg-light shadow-sm rounded">
                <h3>Spending Summary</h3>
                <ul id="spending-summary" class="list-group"></ul>
            </div>

            <!-- Visualizations -->
            <div class="charts-section my-4">
                <h3>Visualizations</h3>
                <div class="row">
                    <div class="col-md-6">
                        <canvas id="budget-bar-chart" width="400" height="300"></canvas>
                    </div>
                    <div class="col-md-6">
                        <canvas id="spending-trends-chart" width="400" height="300"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;

    // JavaScript to Handle Budget Form and Charts
    const budgetData = {
        categories: [],
        amounts: [],
        dates: [],
    };

    const form = document.getElementById('budget-form');
    const savingsInput = document.getElementById('savings-goal');
    const savingsProgressBar = document.getElementById('savings-progress-bar');
    const spendingSummary = document.getElementById('spending-summary');

    const updateSavingsProgress = () => {
        const goal = parseFloat(savingsInput.value) || 0;
        const saved = budgetData.amounts.reduce((a, b) => a + b, 0);
        const percentage = Math.min((saved / goal) * 100, 100);
        savingsProgressBar.style.width = `${percentage}%`;
        savingsProgressBar.textContent = `${Math.round(percentage)}% Saved`;
    };

    const updateSpendingSummary = () => {
        spendingSummary.innerHTML = '';
        const totalSpent = budgetData.amounts.reduce((a, b) => a + b, 0);
        budgetData.categories.forEach((category, index) => {
            const li = document.createElement('li');
            const percentage = ((budgetData.amounts[index] / totalSpent) * 100).toFixed(2);
            li.className = 'list-group-item';
            li.textContent = `${category}: $${budgetData.amounts[index]} (${percentage}%)`;
            spendingSummary.appendChild(li);
        });
    };

    form.onsubmit = (e) => {
        e.preventDefault();
        const category = document.getElementById('category').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const date = new Date().toISOString().split('T')[0]; // Get today's date

        if (category && amount) {
            budgetData.categories.push(category);
            budgetData.amounts.push(amount);
            budgetData.dates.push(date);

            updateCharts();
            updateSavingsProgress();
            updateSpendingSummary();
            form.reset();
        }
    };

    const barChartCtx = document.getElementById('budget-bar-chart').getContext('2d');
    const trendsChartCtx = document.getElementById('spending-trends-chart').getContext('2d');

    const barChart = new Chart(barChartCtx, {
        type: 'bar',
        data: {
            labels: budgetData.categories,
            datasets: [{
                label: 'Budget Allocation',
                data: budgetData.amounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    const trendsChart = new Chart(trendsChartCtx, {
        type: 'line',
        data: {
            labels: budgetData.dates,
            datasets: budgetData.categories.map((category, index) => ({
                label: category,
                data: budgetData.amounts[index] ? [budgetData.amounts[index]] : [],
                fill: false,
                borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                tension: 0.1,
            })),
        },
        options: {
            responsive: true,
        },
    });

    const updateCharts = () => {
        barChart.data.labels = budgetData.categories;
        barChart.data.datasets[0].data = budgetData.amounts;
        barChart.update();

        trendsChart.data.labels = budgetData.dates;
        trendsChart.data.datasets = budgetData.categories.map((category, index) => ({
            label: category,
            data: budgetData.amounts[index] ? [budgetData.amounts[index]] : [],
            fill: false,
            borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
            tension: 0.1,
        }));
        trendsChart.update();
    };
}


    