/* ===========================
   ADVANCED LOAN CALCULATOR SUITE
   Complete Multi-Feature Finance Tool
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
    
    /* ===========================
       THEME TOGGLE
       =========================== */
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
    
    /* ===========================
       TAB NAVIGATION
       =========================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked
            this.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
    
    /* ===========================
       VIEW TOGGLE FOR AMORTIZATION
       =========================== */
    function setupViewToggle() {
        const viewBtns = document.querySelectorAll('.view-btn');
        
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const viewType = this.getAttribute('data-view');
                
                // Remove active class
                viewBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Toggle views
                const tableView = document.getElementById('tableView');
                const graphView = document.getElementById('graphView');
                
                if (viewType === 'table') {
                    tableView.classList.add('active');
                    graphView.classList.remove('active');
                } else {
                    tableView.classList.remove('active');
                    graphView.classList.add('active');
                    
                    // Redraw graph when switching to graph view
                    if (currentSchedule.length > 0) {
                        setTimeout(() => {
                            createAmortizationGraph(currentSchedule);
                        }, 100);
                    }
                }
            });
        });
    }
    
    /* ===========================
       GRAPH CONTROLS
       =========================== */
    function setupGraphControls() {
        const graphControls = ['showPrincipal', 'showInterest', 'showBalance'];
        graphControls.forEach(controlId => {
            const checkbox = document.getElementById(controlId);
            if (checkbox) {
                checkbox.addEventListener('change', function() {
                    if (currentSchedule.length > 0) {
                        createAmortizationGraph(currentSchedule);
                    }
                });
            }
        });
    }
    
    /* ===========================
       PERIOD TOGGLE (MONTHLY/YEARLY)
       =========================== */
    function setupPeriodToggle() {
        const periodBtns = document.querySelectorAll('.period-btn');
        
        periodBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const period = this.getAttribute('data-period');
                
                // Remove active class
                periodBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update view
                currentPeriodView = period;
                if (currentSchedule.length > 0) {
                    displayAmortizationByPeriod(currentSchedule, period);
                }
            });
        });
    }
    
    // Initialize view toggle, graph controls, and period toggle
    setupViewToggle();
    setupGraphControls();
    setupPeriodToggle();
    
    /* ===========================
       EMI CALCULATOR
       =========================== */
    const emiForm = document.getElementById('emiForm');
    let currentSchedule = []; // Store for export
    let currentPeriodView = 'monthly'; // Track current view
    
    emiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const loanAmount = parseFloat(document.getElementById('emiLoanAmount').value);
        const annualRate = parseFloat(document.getElementById('emiInterestRate').value);
        const tenure = parseFloat(document.getElementById('emiTenure').value);
        const tenureType = document.getElementById('emiTenureType').value;
        
        // Convert to months
        const totalMonths = tenureType === 'years' ? tenure * 12 : tenure;
        
        // Calculate EMI
        const result = calculateEMI(loanAmount, annualRate, totalMonths);
        
        // Display results
        displayEMIResults(result, loanAmount);
        
        // Generate and display amortization schedule
        currentSchedule = generateAmortization(loanAmount, annualRate, result.emi, totalMonths);
        displayAmortizationByPeriod(currentSchedule, currentPeriodView);
        
        // Create charts
        createEMICharts(loanAmount, result.totalInterest, currentSchedule);
        
        // Show results
        document.getElementById('emiResults').classList.remove('hidden');
        document.getElementById('emiResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    
    /* ===========================
       TENURE CALCULATOR
       =========================== */
    const tenureForm = document.getElementById('tenureForm');
    
    tenureForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const loanAmount = parseFloat(document.getElementById('tenureLoanAmount').value);
        const emi = parseFloat(document.getElementById('tenureEMI').value);
        const annualRate = parseFloat(document.getElementById('tenureInterestRate').value);
        
        // Calculate tenure
        const result = calculateTenure(loanAmount, emi, annualRate);
        
        // Display results
        displayTenureResults(result);
        
        // Show results
        document.getElementById('tenureResults').classList.remove('hidden');
        document.getElementById('tenureResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    
    /* ===========================
       RATE ESTIMATOR
       =========================== */
    const rateForm = document.getElementById('rateForm');
    
    rateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const loanAmount = parseFloat(document.getElementById('rateLoanAmount').value);
        const emi = parseFloat(document.getElementById('rateEMI').value);
        const tenure = parseFloat(document.getElementById('rateTenure').value);
        const tenureType = document.getElementById('rateTenureType').value;
        
        const totalMonths = tenureType === 'years' ? tenure * 12 : tenure;
        
        // Estimate rate
        const result = estimateInterestRate(loanAmount, emi, totalMonths);
        
        // Display results
        displayRateResults(result);
        
        // Show results
        document.getElementById('rateResults').classList.remove('hidden');
        document.getElementById('rateResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    
    /* ===========================
       PREPAYMENT CALCULATOR
       =========================== */
    const prepaymentForm = document.getElementById('prepaymentForm');
    
    prepaymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const loanAmount = parseFloat(document.getElementById('prepayLoanAmount').value);
        const annualRate = parseFloat(document.getElementById('prepayInterestRate').value);
        const tenure = parseFloat(document.getElementById('prepayTenure').value);
        const tenureType = document.getElementById('prepayTenureType').value;
        const prepayAmount = parseFloat(document.getElementById('prepayAmount').value);
        const afterMonths = parseFloat(document.getElementById('prepayAfterMonths').value);
        const prepayOption = document.querySelector('input[name="prepayOption"]:checked').value;
        
        const totalMonths = tenureType === 'years' ? tenure * 12 : tenure;
        
        // Calculate prepayment impact
        const result = calculatePrepayment(loanAmount, annualRate, totalMonths, prepayAmount, afterMonths, prepayOption);
        
        // Display results
        displayPrepaymentResults(result);
        
        // Show results
        document.getElementById('prepaymentResults').classList.remove('hidden');
        document.getElementById('prepaymentResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    
    /* ===========================
       EXPORT FUNCTIONALITY
       =========================== */
    document.getElementById('exportPDF').addEventListener('click', function() {
        exportToPDF(currentSchedule);
    });
    
    document.getElementById('exportExcel').addEventListener('click', function() {
        exportToExcel(currentSchedule);
    });
    
    document.getElementById('exportCSV').addEventListener('click', function() {
        exportToCSV(currentSchedule);
    });
    
    document.getElementById('printTable').addEventListener('click', function() {
        printAmortizationTable(currentSchedule);
    });
    
    /* ===========================
       CALCULATION FUNCTIONS
       =========================== */
    
    // EMI Calculation: EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]
    function calculateEMI(principal, annualRate, months) {
        const monthlyRate = (annualRate / 12) / 100;
        const denominator = Math.pow(1 + monthlyRate, months) - 1;
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / denominator;
        const totalPayment = emi * months;
        const totalInterest = totalPayment - principal;
        
        return { emi, totalPayment, totalInterest };
    }
    
    // Tenure Calculation
    function calculateTenure(principal, emi, annualRate) {
        const monthlyRate = (annualRate / 12) / 100;
        
        // Formula: N = log(EMI / (EMI - P*R)) / log(1 + R)
        const numerator = Math.log(emi / (emi - principal * monthlyRate));
        const denominator = Math.log(1 + monthlyRate);
        const months = Math.ceil(numerator / denominator);
        
        const totalPayment = emi * months;
        const totalInterest = totalPayment - principal;
        
        return { months, totalPayment, totalInterest };
    }
    
    // Interest Rate Estimation using Newton-Raphson Method
    function estimateInterestRate(principal, emi, months) {
        let rate = 0.1; // Initial guess (10% annual)
        const tolerance = 0.0001;
        const maxIterations = 100;
        
        for (let i = 0; i < maxIterations; i++) {
            const monthlyRate = rate / 12 / 100;
            const power = Math.pow(1 + monthlyRate, months);
            const calculatedEMI = (principal * monthlyRate * power) / (power - 1);
            
            if (Math.abs(calculatedEMI - emi) < tolerance) {
                break;
            }
            
            // Derivative approximation
            const delta = 0.0001;
            const monthlyRate2 = (rate + delta) / 12 / 100;
            const power2 = Math.pow(1 + monthlyRate2, months);
            const calculatedEMI2 = (principal * monthlyRate2 * power2) / (power2 - 1);
            const derivative = (calculatedEMI2 - calculatedEMI) / delta;
            
            // Newton-Raphson update
            rate = rate - (calculatedEMI - emi) / derivative;
            
            // Ensure rate stays positive
            if (rate < 0) rate = 0.1;
        }
        
        const totalPayment = emi * months;
        const totalInterest = totalPayment - principal;
        
        return { rate, totalPayment, totalInterest };
    }
    
    // Amortization Schedule Generation
    function generateAmortization(principal, annualRate, emi, months) {
        const schedule = [];
        const monthlyRate = (annualRate / 12) / 100;
        let balance = principal;
        
        for (let month = 1; month <= months; month++) {
            const interest = balance * monthlyRate;
            const principalPaid = emi - interest;
            balance -= principalPaid;
            
            // Handle final month rounding
            if (month === months) balance = 0;
            
            schedule.push({
                month,
                emi,
                principal: principalPaid,
                interest,
                balance: Math.max(0, balance)
            });
        }
        
        return schedule;
    }
    
    // Prepayment Calculation
    function calculatePrepayment(principal, annualRate, months, prepayAmount, afterMonths, option) {
        // Calculate original loan details
        const original = calculateEMI(principal, annualRate, months);
        const originalSchedule = generateAmortization(principal, annualRate, original.emi, months);
        
        // Get remaining balance after specified months
        const remainingBalance = originalSchedule[afterMonths - 1].balance - prepayAmount;
        const remainingMonths = months - afterMonths;
        
        let result = {
            original: {
                emi: original.emi,
                tenure: months,
                totalInterest: original.totalInterest,
                totalPayment: original.totalPayment
            },
            new: {},
            savings: {}
        };
        
        if (option === 'reduceTenure') {
            // Keep EMI same, reduce tenure
            const newTenure = calculateTenure(remainingBalance, original.emi, annualRate);
            const newSchedule = generateAmortization(remainingBalance, annualRate, original.emi, newTenure.months);
            
            // Calculate total interest including prepayment period
            const interestPaidBefore = originalSchedule.slice(0, afterMonths).reduce((sum, m) => sum + m.interest, 0);
            const totalNewInterest = interestPaidBefore + newTenure.totalInterest;
            
            result.new = {
                emi: original.emi,
                tenure: afterMonths + newTenure.months,
                totalInterest: totalNewInterest,
                totalPayment: principal + prepayAmount + totalNewInterest
            };
            
            result.savings = {
                interest: original.totalInterest - totalNewInterest,
                tenure: months - (afterMonths + newTenure.months),
                emi: 0
            };
            
        } else {
            // Keep tenure same, reduce EMI
            const newEMI = calculateEMI(remainingBalance, annualRate, remainingMonths);
            const newSchedule = generateAmortization(remainingBalance, annualRate, newEMI.emi, remainingMonths);
            
            // Calculate total interest
            const interestPaidBefore = originalSchedule.slice(0, afterMonths).reduce((sum, m) => sum + m.interest, 0);
            const totalNewInterest = interestPaidBefore + newEMI.totalInterest;
            
            result.new = {
                emi: newEMI.emi,
                tenure: months,
                totalInterest: totalNewInterest,
                totalPayment: principal + prepayAmount + totalNewInterest
            };
            
            result.savings = {
                interest: original.totalInterest - totalNewInterest,
                tenure: 0,
                emi: original.emi - newEMI.emi
            };
        }
        
        return result;
    }
    
    /* ===========================
       DISPLAY FUNCTIONS
       =========================== */
    
    function displayEMIResults(result, principal) {
        document.getElementById('emiMonthly').textContent = formatCurrency(result.emi);
        document.getElementById('emiPrincipal').textContent = formatCurrency(principal);
        document.getElementById('emiInterest').textContent = formatCurrency(result.totalInterest);
        document.getElementById('emiTotal').textContent = formatCurrency(result.totalPayment);
    }
    
    function displayTenureResults(result) {
        const years = Math.floor(result.months / 12);
        const months = result.months % 12;
        
        document.getElementById('tenureMonths').textContent = `${result.months} months`;
        document.getElementById('tenureYears').textContent = `(${years} years ${months > 0 ? months + ' months' : ''})`;
        document.getElementById('tenureTotal').textContent = formatCurrency(result.totalPayment);
        document.getElementById('tenureInterest').textContent = formatCurrency(result.totalInterest);
    }
    
    function displayRateResults(result) {
        document.getElementById('rateEstimated').textContent = result.rate.toFixed(2) + '%';
        document.getElementById('rateTotal').textContent = formatCurrency(result.totalPayment);
        document.getElementById('rateInterest').textContent = formatCurrency(result.totalInterest);
    }
    
    function displayPrepaymentResults(result) {
        // Original
        document.getElementById('prepayOriginalEMI').textContent = formatCurrency(result.original.emi);
        document.getElementById('prepayOriginalTenure').textContent = result.original.tenure + ' months';
        document.getElementById('prepayOriginalInterest').textContent = formatCurrency(result.original.totalInterest);
        document.getElementById('prepayOriginalTotal').textContent = formatCurrency(result.original.totalPayment);
        
        // New
        document.getElementById('prepayNewEMI').textContent = formatCurrency(result.new.emi);
        document.getElementById('prepayNewTenure').textContent = result.new.tenure + ' months';
        document.getElementById('prepayNewInterest').textContent = formatCurrency(result.new.totalInterest);
        document.getElementById('prepayNewTotal').textContent = formatCurrency(result.new.totalPayment);
        
        // Savings
        document.getElementById('prepaySavedInterest').textContent = formatCurrency(result.savings.interest);
        document.getElementById('prepaySavedTenure').textContent = result.savings.tenure + ' months';
        document.getElementById('prepaySavedEMI').textContent = formatCurrency(result.savings.emi);
    }
    
    function displayAmortizationTable(schedule, tableBodyId) {
        const tbody = document.getElementById(tableBodyId);
        tbody.innerHTML = '';
        
        let totalPaid = 0;
        
        schedule.forEach(row => {
            totalPaid += row.emi;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.month}</td>
                <td>${formatCurrency(row.emi)}</td>
                <td>${formatCurrency(row.principal)}</td>
                <td>${formatCurrency(row.interest)}</td>
                <td>${formatCurrency(row.balance)}</td>
                <td>${formatCurrency(totalPaid)}</td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    /* ===========================
       DISPLAY AMORTIZATION BY PERIOD
       (Monthly or Yearly View)
       =========================== */
    function displayAmortizationByPeriod(schedule, period) {
        const periodHeader = document.getElementById('periodHeader');
        
        if (period === 'yearly') {
            periodHeader.textContent = 'Year';
            displayYearlyAmortization(schedule);
        } else {
            periodHeader.textContent = 'Month';
            displayAmortizationTable(schedule, 'emiAmortizationBody');
        }
    }
    
    /* ===========================
       DISPLAY YEARLY AMORTIZATION
       =========================== */
    function displayYearlyAmortization(schedule) {
        const tbody = document.getElementById('emiAmortizationBody');
        tbody.innerHTML = '';
        
        const totalYears = Math.ceil(schedule.length / 12);
        let cumulativePaid = 0;
        
        for (let year = 1; year <= totalYears; year++) {
            const startMonth = (year - 1) * 12;
            const endMonth = Math.min(year * 12, schedule.length);
            const yearData = schedule.slice(startMonth, endMonth);
            
            // Calculate yearly totals
            const yearlyEMI = yearData.reduce((sum, m) => sum + m.emi, 0);
            const yearlyPrincipal = yearData.reduce((sum, m) => sum + m.principal, 0);
            const yearlyInterest = yearData.reduce((sum, m) => sum + m.interest, 0);
            const endBalance = yearData[yearData.length - 1].balance;
            
            cumulativePaid += yearlyEMI;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>Year ${year}</strong></td>
                <td>${formatCurrency(yearlyEMI)}</td>
                <td>${formatCurrency(yearlyPrincipal)}</td>
                <td>${formatCurrency(yearlyInterest)}</td>
                <td>${formatCurrency(endBalance)}</td>
                <td>${formatCurrency(cumulativePaid)}</td>
            `;
            tbody.appendChild(tr);
        }
    }
    
    /* ===========================
       CHART FUNCTIONS
       =========================== */
    
    function createEMICharts(principal, totalInterest, schedule) {
        createPieChart(principal, totalInterest);
        createLineChart(schedule);
        createBarChart(schedule);
        createAmortizationGraph(schedule);
    }
    
    function createPieChart(principal, totalInterest) {
        const canvas = document.getElementById('emiPieChart');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 300;
        canvas.height = 300;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const total = principal + totalInterest;
        const data = [
            { label: 'Principal', value: principal, color: '#667eea', percent: (principal/total)*100 },
            { label: 'Interest', value: totalInterest, color: '#f87171', percent: (totalInterest/total)*100 }
        ];
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;
        let currentAngle = -Math.PI / 2;
        
        data.forEach(item => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = item.color;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            currentAngle += sliceAngle;
        });
        
        // Legend
        let legendY = canvas.height - 60;
        data.forEach(item => {
            ctx.fillStyle = item.color;
            ctx.fillRect(10, legendY, 15, 15);
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
            ctx.font = '12px Arial';
            ctx.fillText(`${item.label}: ${formatCurrency(item.value)} (${item.percent.toFixed(1)}%)`, 30, legendY + 12);
            legendY += 20;
        });
    }
    
    function createLineChart(schedule) {
        const canvas = document.getElementById('emiLineChart');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 600;
        canvas.height = 300;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 50;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        
        // Sample data for readability
        const dataPoints = [];
        const interval = schedule.length > 120 ? 12 : Math.max(1, Math.floor(schedule.length / 50));
        for (let i = 0; i < schedule.length; i += interval) {
            dataPoints.push(schedule[i]);
        }
        dataPoints.push(schedule[schedule.length - 1]);
        
        const maxBalance = schedule[0].balance;
        const maxMonth = schedule.length;
        
        // Axes
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Line
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();
        dataPoints.forEach((point, i) => {
            const x = padding + (point.month / maxMonth) * chartWidth;
            const y = canvas.height - padding - (point.balance / maxBalance) * chartHeight;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        // Points
        ctx.fillStyle = '#667eea';
        dataPoints.forEach(point => {
            const x = padding + (point.month / maxMonth) * chartWidth;
            const y = canvas.height - padding - (point.balance / maxBalance) * chartHeight;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Labels
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Months', canvas.width / 2, canvas.height - 10);
    }
    
    function createBarChart(schedule) {
        const canvas = document.getElementById('emiBarChart');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 800;
        canvas.height = 300;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Group by year
        const yearlyData = [];
        const yearsCount = Math.ceil(schedule.length / 12);
        
        for (let year = 0; year < yearsCount; year++) {
            const start = year * 12;
            const end = Math.min(start + 12, schedule.length);
            const yearSchedule = schedule.slice(start, end);
            
            const principalSum = yearSchedule.reduce((sum, m) => sum + m.principal, 0);
            const interestSum = yearSchedule.reduce((sum, m) => sum + m.interest, 0);
            
            yearlyData.push({
                year: year + 1,
                principal: principalSum,
                interest: interestSum
            });
        }
        
        const padding = 50;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const barWidth = chartWidth / (yearlyData.length * 2.5);
        const maxValue = Math.max(...yearlyData.map(d => d.principal + d.interest));
        
        yearlyData.forEach((data, i) => {
            const x = padding + (i * barWidth * 2.5);
            
            // Interest bar (bottom)
            const interestHeight = (data.interest / maxValue) * chartHeight;
            ctx.fillStyle = '#f87171';
            ctx.fillRect(x, canvas.height - padding - interestHeight, barWidth, interestHeight);
            
            // Principal bar (top)
            const principalHeight = (data.principal / maxValue) * chartHeight;
            ctx.fillStyle = '#667eea';
            ctx.fillRect(x, canvas.height - padding - interestHeight - principalHeight, barWidth, principalHeight);
            
            // Year label
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Y${data.year}`, x + barWidth / 2, canvas.height - padding + 15);
        });
        
        // Legend
        ctx.fillStyle = '#667eea';
        ctx.fillRect(padding, 20, 15, 15);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Principal', padding + 20, 32);
        
        ctx.fillStyle = '#f87171';
        ctx.fillRect(padding + 100, 20, 15, 15);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
        ctx.fillText('Interest', padding + 120, 32);
    }
    
    function createAmortizationGraph(schedule) {
        const canvas = document.getElementById('amortizationGraph');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Set canvas size based on container
        const container = canvas.parentElement;
        canvas.width = container.clientWidth || 900;
        canvas.height = 500;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 60;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        
        // Get checkbox states safely
        const showPrincipalEl = document.getElementById('showPrincipal');
        const showInterestEl = document.getElementById('showInterest');
        const showBalanceEl = document.getElementById('showBalance');
        
        const showPrincipal = showPrincipalEl ? showPrincipalEl.checked : true;
        const showInterest = showInterestEl ? showInterestEl.checked : true;
        const showBalance = showBalanceEl ? showBalanceEl.checked : true;
        
        // Sample data points for performance
        const dataPoints = [];
        const interval = schedule.length > 120 ? Math.ceil(schedule.length / 100) : 1;
        for (let i = 0; i < schedule.length; i += interval) {
            dataPoints.push(schedule[i]);
        }
        if (dataPoints[dataPoints.length - 1].month !== schedule[schedule.length - 1].month) {
            dataPoints.push(schedule[schedule.length - 1]);
        }
        
        // Find max values for scaling
        const maxPrincipal = Math.max(...dataPoints.map(d => d.principal));
        const maxInterest = Math.max(...dataPoints.map(d => d.interest));
        const maxBalance = Math.max(...dataPoints.map(d => d.balance));
        const maxValue = Math.max(maxPrincipal, maxInterest, maxBalance);
        const maxMonth = schedule.length;
        
        // Get theme colors
        const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#e5e7eb';
        const textPrimary = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#1f2937';
        const textSecondary = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#6b7280';
        
        // Draw axes
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Draw grid lines
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([5, 5]);
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }
        ctx.setLineDash([]);
        
        // Helper function to draw line
        function drawLine(data, getValue, color, label) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            let started = false;
            dataPoints.forEach((point, i) => {
                const x = padding + (point.month / maxMonth) * chartWidth;
                const value = getValue(point);
                const y = canvas.height - padding - (value / maxValue) * chartHeight;
                
                if (!started) {
                    ctx.moveTo(x, y);
                    started = true;
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            // Draw points
            ctx.fillStyle = color;
            dataPoints.forEach((point) => {
                const x = padding + (point.month / maxMonth) * chartWidth;
                const value = getValue(point);
                const y = canvas.height - padding - (value / maxValue) * chartHeight;
                
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
        
        // Draw lines based on checkboxes
        if (showBalance) {
            drawLine(dataPoints, d => d.balance, '#667eea', 'Balance');
        }
        if (showPrincipal) {
            drawLine(dataPoints, d => d.principal, '#4ade80', 'Principal');
        }
        if (showInterest) {
            drawLine(dataPoints, d => d.interest, '#f87171', 'Interest');
        }
        
        // Draw labels
        ctx.fillStyle = textPrimary;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Month', canvas.width / 2, canvas.height - 15);
        
        ctx.save();
        ctx.translate(20, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Amount (₹)', 0, 0);
        ctx.restore();
        
        // Draw axis values
        ctx.font = '11px Arial';
        ctx.fillStyle = textSecondary;
        
        // X-axis values
        const xSteps = 10;
        for (let i = 0; i <= xSteps; i++) {
            const month = Math.round((maxMonth / xSteps) * i);
            const x = padding + (month / maxMonth) * chartWidth;
            ctx.textAlign = 'center';
            ctx.fillText(month, x, canvas.height - padding + 20);
        }
        
        // Y-axis values
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = (maxValue / 5) * (5 - i);
            const y = padding + (chartHeight / 5) * i;
            ctx.fillText(formatShortCurrency(value), padding - 10, y + 4);
        }
        
        // Draw legend
        const legendX = canvas.width - padding - 200;
        let legendY = padding + 20;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        
        const legendItems = [];
        if (showBalance) legendItems.push({ label: 'Remaining Balance', color: '#667eea' });
        if (showPrincipal) legendItems.push({ label: 'Principal Payment', color: '#4ade80' });
        if (showInterest) legendItems.push({ label: 'Interest Payment', color: '#f87171' });
        
        legendItems.forEach(item => {
            ctx.fillStyle = item.color;
            ctx.fillRect(legendX, legendY - 10, 20, 4);
            ctx.fillStyle = textPrimary;
            ctx.fillText(item.label, legendX + 25, legendY);
            legendY += 20;
        });
    }
    
    function formatShortCurrency(amount) {
        if (amount >= 10000000) {
            return '₹' + (amount / 10000000).toFixed(1) + 'Cr';
        } else if (amount >= 100000) {
            return '₹' + (amount / 100000).toFixed(1) + 'L';
        } else if (amount >= 1000) {
            return '₹' + (amount / 1000).toFixed(0) + 'K';
        }
        return '₹' + amount.toFixed(0);
    }
    
    /* ===========================
       EXPORT FUNCTIONS
       =========================== */
    
    function exportToPDF(schedule) {
        if (!schedule || schedule.length === 0) {
            alert('Please calculate EMI first!');
            return;
        }
        
        // Create printable HTML with better styling
        const printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.write('<html><head><title>Loan Amortization Schedule</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('* { margin: 0; padding: 0; box-sizing: border-box; }');
        printWindow.document.write('body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }');
        printWindow.document.write('.header { text-align: center; margin-bottom: 30px; }');
        printWindow.document.write('h1 { color: #667eea; margin-bottom: 10px; font-size: 28px; }');
        printWindow.document.write('.date { color: #666; font-size: 14px; }');
        printWindow.document.write('.summary { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }');
        printWindow.document.write('.summary-item { display: inline-block; margin: 10px 20px; }');
        printWindow.document.write('.summary-label { color: #666; font-size: 12px; display: block; margin-bottom: 5px; }');
        printWindow.document.write('.summary-value { color: #333; font-size: 18px; font-weight: bold; }');
        printWindow.document.write('table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }');
        printWindow.document.write('th { background: #667eea; color: white; padding: 12px; text-align: left; font-size: 12px; }');
        printWindow.document.write('td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 11px; }');
        printWindow.document.write('tr:nth-child(even) { background: #f9f9f9; }');
        printWindow.document.write('tr:hover { background: #f0f0f0; }');
        printWindow.document.write('.footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }');
        printWindow.document.write('@media print { body { background: white; } .no-print { display: none; } }');
        printWindow.document.write('</style></head><body>');
        
        // Header
        printWindow.document.write('<div class="header">');
        printWindow.document.write('<h1>📊 Loan Amortization Schedule</h1>');
        printWindow.document.write('<p class="date">Generated on: ' + new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        }) + '</p>');
        printWindow.document.write('</div>');
        
        // Summary
        const totalPaid = schedule.reduce((sum, m) => sum + m.emi, 0);
        const totalPrincipal = schedule.reduce((sum, m) => sum + m.principal, 0);
        const totalInterest = schedule.reduce((sum, m) => sum + m.interest, 0);
        
        printWindow.document.write('<div class="summary">');
        printWindow.document.write('<div class="summary-item"><span class="summary-label">Total Months</span><span class="summary-value">' + schedule.length + '</span></div>');
        printWindow.document.write('<div class="summary-item"><span class="summary-label">Monthly EMI</span><span class="summary-value">' + formatCurrency(schedule[0].emi) + '</span></div>');
        printWindow.document.write('<div class="summary-item"><span class="summary-label">Total Principal</span><span class="summary-value">' + formatCurrency(totalPrincipal) + '</span></div>');
        printWindow.document.write('<div class="summary-item"><span class="summary-label">Total Interest</span><span class="summary-value">' + formatCurrency(totalInterest) + '</span></div>');
        printWindow.document.write('<div class="summary-item"><span class="summary-label">Total Payment</span><span class="summary-value">' + formatCurrency(totalPaid) + '</span></div>');
        printWindow.document.write('</div>');
        
        // Table
        printWindow.document.write('<table>');
        printWindow.document.write('<thead><tr><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th><th>Total Paid</th></tr></thead>');
        printWindow.document.write('<tbody>');
        
        let cumulativePaid = 0;
        schedule.forEach(row => {
            cumulativePaid += row.emi;
            printWindow.document.write(`<tr>
                <td>${row.month}</td>
                <td>${formatCurrency(row.emi)}</td>
                <td>${formatCurrency(row.principal)}</td>
                <td>${formatCurrency(row.interest)}</td>
                <td>${formatCurrency(row.balance)}</td>
                <td>${formatCurrency(cumulativePaid)}</td>
            </tr>`);
        });
        
        printWindow.document.write('</tbody></table>');
        
        // Footer
        printWindow.document.write('<div class="footer">');
        printWindow.document.write('<p>Loan Calculator Suite - Advanced Financial Planning Tool</p>');
        printWindow.document.write('</div>');
        
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        // Auto print
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
    
    function exportToExcel(schedule) {
        if (!schedule || schedule.length === 0) {
            alert('Please calculate EMI first!');
            return;
        }
        
        // Create CSV with proper Excel formatting
        let csv = '\uFEFF'; // BOM for UTF-8
        csv += 'Loan Amortization Schedule\n';
        csv += 'Generated on: ' + new Date().toLocaleDateString('en-IN') + '\n\n';
        
        // Summary
        const totalPaid = schedule.reduce((sum, m) => sum + m.emi, 0);
        const totalPrincipal = schedule.reduce((sum, m) => sum + m.principal, 0);
        const totalInterest = schedule.reduce((sum, m) => sum + m.interest, 0);
        
        csv += 'Summary\n';
        csv += 'Total Months,' + schedule.length + '\n';
        csv += 'Monthly EMI,' + schedule[0].emi.toFixed(2) + '\n';
        csv += 'Total Principal,' + totalPrincipal.toFixed(2) + '\n';
        csv += 'Total Interest,' + totalInterest.toFixed(2) + '\n';
        csv += 'Total Payment,' + totalPaid.toFixed(2) + '\n\n';
        
        // Table header
        csv += 'Month,EMI,Principal,Interest,Balance,Total Paid\n';
        
        // Table data
        let cumulativePaid = 0;
        schedule.forEach(row => {
            cumulativePaid += row.emi;
            csv += `${row.month},${row.emi.toFixed(2)},${row.principal.toFixed(2)},${row.interest.toFixed(2)},${row.balance.toFixed(2)},${cumulativePaid.toFixed(2)}\n`;
        });
        
        // Create and download
        const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'Loan_Amortization_' + new Date().toISOString().split('T')[0] + '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    function exportToCSV(schedule) {
        if (!schedule || schedule.length === 0) {
            alert('Please calculate EMI first!');
            return;
        }
        
        try {
            // Create simple CSV
            let csv = 'Month,EMI,Principal,Interest,Balance,Total Paid\n';
            
            let cumulativePaid = 0;
            schedule.forEach(row => {
                cumulativePaid += row.emi;
                csv += `${row.month},${row.emi.toFixed(2)},${row.principal.toFixed(2)},${row.interest.toFixed(2)},${row.balance.toFixed(2)},${cumulativePaid.toFixed(2)}\n`;
            });
            
            // Create blob and download
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, 'amortization_schedule.csv');
            } else {
                const url = URL.createObjectURL(blob);
                link.href = url;
                link.download = 'amortization_schedule_' + new Date().toISOString().split('T')[0] + '.csv';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('CSV Export Error:', error);
            alert('Failed to export CSV. Please try again.');
        }
    }
    
    function printAmortizationTable(schedule) {
        if (!schedule || schedule.length === 0) {
            alert('Please calculate EMI first!');
            return;
        }
        
        try {
            // Use the same PDF generation for printing
            const printWindow = window.open('', '_blank', 'width=1000,height=800');
            
            if (!printWindow) {
                alert('Please allow popups to print the table.');
                return;
            }
            
            printWindow.document.write('<html><head><title>Loan Amortization Schedule</title>');
            printWindow.document.write('<style>');
            printWindow.document.write('* { margin: 0; padding: 0; box-sizing: border-box; }');
            printWindow.document.write('body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }');
            printWindow.document.write('.header { text-align: center; margin-bottom: 30px; }');
            printWindow.document.write('h1 { color: #667eea; margin-bottom: 10px; font-size: 28px; }');
            printWindow.document.write('.date { color: #666; font-size: 14px; }');
            printWindow.document.write('.summary { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }');
            printWindow.document.write('.summary-item { display: inline-block; margin: 10px 20px; }');
            printWindow.document.write('.summary-label { color: #666; font-size: 12px; display: block; margin-bottom: 5px; }');
            printWindow.document.write('.summary-value { color: #333; font-size: 18px; font-weight: bold; }');
            printWindow.document.write('table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }');
            printWindow.document.write('th { background: #667eea; color: white; padding: 12px; text-align: left; font-size: 12px; }');
            printWindow.document.write('td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 11px; }');
            printWindow.document.write('tr:nth-child(even) { background: #f9f9f9; }');
            printWindow.document.write('.footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }');
            printWindow.document.write('@media print { body { background: white; } }');
            printWindow.document.write('</style></head><body>');
            
            // Header
            printWindow.document.write('<div class="header">');
            printWindow.document.write('<h1>📊 Loan Amortization Schedule</h1>');
            printWindow.document.write('<p class="date">Generated on: ' + new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', month: 'long', day: 'numeric' 
            }) + '</p>');
            printWindow.document.write('</div>');
            
            // Summary
            const totalPaid = schedule.reduce((sum, m) => sum + m.emi, 0);
            const totalPrincipal = schedule.reduce((sum, m) => sum + m.principal, 0);
            const totalInterest = schedule.reduce((sum, m) => sum + m.interest, 0);
            
            printWindow.document.write('<div class="summary">');
            printWindow.document.write('<div class="summary-item"><span class="summary-label">Total Months</span><span class="summary-value">' + schedule.length + '</span></div>');
            printWindow.document.write('<div class="summary-item"><span class="summary-label">Monthly EMI</span><span class="summary-value">' + formatCurrency(schedule[0].emi) + '</span></div>');
            printWindow.document.write('<div class="summary-item"><span class="summary-label">Total Principal</span><span class="summary-value">' + formatCurrency(totalPrincipal) + '</span></div>');
            printWindow.document.write('<div class="summary-item"><span class="summary-label">Total Interest</span><span class="summary-value">' + formatCurrency(totalInterest) + '</span></div>');
            printWindow.document.write('<div class="summary-item"><span class="summary-label">Total Payment</span><span class="summary-value">' + formatCurrency(totalPaid) + '</span></div>');
            printWindow.document.write('</div>');
            
            // Table
            printWindow.document.write('<table>');
            printWindow.document.write('<thead><tr><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th><th>Total Paid</th></tr></thead>');
            printWindow.document.write('<tbody>');
            
            let cumulativePaid = 0;
            schedule.forEach(row => {
                cumulativePaid += row.emi;
                printWindow.document.write(`<tr>
                    <td>${row.month}</td>
                    <td>${formatCurrency(row.emi)}</td>
                    <td>${formatCurrency(row.principal)}</td>
                    <td>${formatCurrency(row.interest)}</td>
                    <td>${formatCurrency(row.balance)}</td>
                    <td>${formatCurrency(cumulativePaid)}</td>
                </tr>`);
            });
            
            printWindow.document.write('</tbody></table>');
            
            // Footer
            printWindow.document.write('<div class="footer">');
            printWindow.document.write('<p>Loan Calculator Suite - Advanced Financial Planning Tool</p>');
            printWindow.document.write('</div>');
            
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            
            // Wait for content to load then print
            printWindow.onload = function() {
                printWindow.focus();
                printWindow.print();
            };
            
        } catch (error) {
            console.error('Print Error:', error);
            alert('Failed to print. Please try again.');
        }
    }
    
    /* ===========================
       UTILITY FUNCTIONS
       =========================== */
    
    function formatCurrency(amount) {
        return '₹' + amount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
});