/**
 * ZenTime 2026 - Modern Employee Time Tracker
 * Full Functionality Module
 */

class ZenTimeApp {
    constructor() {
        this.state = {
            isClockedIn: false,
            startTime: null,
            timerInterval: null,
            logs: [],
            currentView: 'home',
            user: {
                name: 'นรินทร์',
                role: 'หัวหน้าทีมพัฒนา'
            },
            chart: null
        };

        this.init();
    }

    init() {
        this.loadState();
        this.setupEventListeners();
        this.renderCurrentDate();
        this.updateHistoryUI();
        this.updateProfileUI();
        this.initStats();
        this.initChart();
        
        if (this.state.isClockedIn) {
            this.resumeTimer();
        }
    }

    loadState() {
        const saved = localStorage.getItem('zentime_state');
        if (saved) {
            const data = JSON.parse(saved);
            this.state.isClockedIn = data.isClockedIn || false;
            this.state.startTime = data.startTime ? new Date(data.startTime) : null;
            this.state.logs = data.logs || [];
            if (data.user) this.state.user = data.user;
        } else {
            this.state.logs = [
                { id: 1, date: '2026-04-07', start: '08:30', end: '17:45', duration: '9h 15m', lat: 13.7563, long: 100.5018 },
                { id: 2, date: '2026-04-06', start: '09:00', end: '18:00', duration: '9h 00m', lat: 13.7563, long: 100.5018 },
                { id: 3, date: '2026-04-03', start: '08:55', end: '17:30', duration: '8h 35m', lat: 13.7563, long: 100.5018 },
                { id: 4, date: '2026-04-02', start: '09:10', end: '18:15', duration: '9h 05m', lat: 13.7563, long: 100.5018 },
                { id: 5, date: '2026-04-01', start: '08:45', end: '17:50', duration: '9h 05m', lat: 13.7563, long: 100.5018 }
            ];
            this.saveState();
        }
    }

    saveState() {
        localStorage.setItem('zentime_state', JSON.stringify({
            isClockedIn: this.state.isClockedIn,
            startTime: this.state.startTime,
            logs: this.state.logs,
            user: this.state.user
        }));
    }

    setupEventListeners() {
        // Clock Button
        document.getElementById('clock-btn').addEventListener('click', () => this.toggleClock());

        // Nav
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.currentTarget.dataset.view));
        });

        // Profile Modal
        document.getElementById('profile-trigger').addEventListener('click', () => this.openProfileModal());
        document.querySelector('.close-modal').addEventListener('click', () => this.closeProfileModal());
        document.getElementById('save-profile-btn').addEventListener('click', () => this.saveProfile());
        
        // Export
        document.getElementById('export-btn').addEventListener('click', () => this.exportCSV());
    }

    // --- Geolocation ---
    async getPosition() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) return resolve({ lat: 0, long: 0 });
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, long: pos.coords.longitude }),
                () => resolve({ lat: 0, long: 0 }),
                { timeout: 5000 }
            );
        });
    }

    // --- Clock Logic ---
    async clockIn() {
        const pos = await this.getPosition();
        this.state.isClockedIn = true;
        this.state.startTime = new Date();
        this.state.lastPos = pos;
        this.saveState();
        this.resumeTimer();
    }

    clockOut() {
        const endTime = new Date();
        const durationMs = endTime - this.state.startTime;
        const durationStr = this.formatDuration(durationMs);

        const log = {
            id: Date.now(),
            date: this.state.startTime.toISOString().split('T')[0],
            start: this.formatTime(this.state.startTime),
            end: this.formatTime(endTime),
            duration: durationStr,
            lat: this.state.lastPos?.lat || 0,
            long: this.state.lastPos?.long || 0
        };

        this.state.logs.unshift(log);
        this.state.isClockedIn = false;
        this.state.startTime = null;
        clearInterval(this.state.timerInterval);
        
        this.saveState();
        this.updateHistoryUI();
        this.initStats();
        this.updateChart();

        // Reset UI
        const btn = document.getElementById('clock-btn');
        btn.className = 'primary-btn clock-in';
        btn.querySelector('.btn-text').textContent = 'Clock In';
        document.getElementById('timer-status-dot').classList.remove('active');
        document.getElementById('main-timer').textContent = '00:00:00';
        document.getElementById('timer-label').textContent = 'พร้อมสำหรับการเข้างาน';
    }

    toggleClock() {
        if (!this.state.isClockedIn) this.clockIn();
        else this.clockOut();
    }

    // --- Profile Management ---
    openProfileModal() {
        document.getElementById('input-name').value = this.state.user.name;
        document.getElementById('input-role').value = this.state.user.role;
        document.getElementById('profile-modal').classList.add('active');
    }

    closeProfileModal() {
        document.getElementById('profile-modal').classList.remove('active');
    }

    saveProfile() {
        this.state.user.name = document.getElementById('input-name').value;
        this.state.user.role = document.getElementById('input-role').value;
        this.saveState();
        this.updateProfileUI();
        this.closeProfileModal();
    }

    updateProfileUI() {
        document.getElementById('display-name').textContent = this.state.user.name;
        document.getElementById('display-role').textContent = this.state.user.role;
    }

    // --- CSV Export ---
    exportCSV() {
        const headers = ['Date', 'Start', 'End', 'Duration', 'Latitude', 'Longitude'];
        const rows = this.state.logs.map(l => [l.date, l.start, l.end, l.duration, l.lat, l.long]);
        
        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `zentime_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- Stats & Charts ---
    initChart() {
        const ctx = document.getElementById('weeklyChart').getContext('2d');
        const data = this.getWeeklyData();

        this.state.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }

    updateChart() {
        const data = this.getWeeklyData();
        this.state.chart.data.labels = data.labels;
        this.state.chart.data.datasets[0].data = data.values;
        this.state.chart.update();
    }

    getWeeklyData() {
        // Calculate hours per day for the last 7 days including today
        const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
        const today = new Date();
        const labels = [];
        const values = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayLabel = days[d.getDay()].substring(0, 1);
            labels.push(dayLabel);

            const dayLogs = this.state.logs.filter(l => l.date === dateStr);
            const hours = dayLogs.reduce((acc, l) => {
                const parts = l.duration.split(' ');
                const h = parseFloat(parts[0]);
                const m = parts[1] ? parseFloat(parts[1]) / 60 : 0;
                return acc + h + m;
            }, 0);
            values.push(hours);
        }
        return { labels, values };
    }

    initStats() {
        const totalHours = this.state.logs.slice(0, 5).reduce((acc, curr) => {
            const h = parseFloat(curr.duration.split('h')[0]);
            return acc + h;
        }, 0);
        document.getElementById('stat-weekly-hours').textContent = totalHours.toFixed(1);
    }

    // --- Helpers ---
    resumeTimer() {
        const btn = document.getElementById('clock-btn');
        btn.className = 'primary-btn clock-out';
        btn.querySelector('.btn-text').textContent = 'Clock Out';
        document.getElementById('timer-status-dot').classList.add('active');
        document.getElementById('timer-label').textContent = 'กำลังทำงานอยู่...';
        
        clearInterval(this.state.timerInterval);
        this.startTick();
    }

    startTick() {
        this.state.timerInterval = setInterval(() => {
            const now = new Date();
            const diff = now - this.state.startTime;
            document.getElementById('main-timer').textContent = [
                Math.floor(diff / 3600000).toString().padStart(2, '0'),
                Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0'),
                Math.floor((diff % 60000) / 1000).toString().padStart(2, '0')
            ].join(':');
        }, 1000);
    }

    formatTime(date) { return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }); }
    formatDuration(ms) { return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`; }
    renderCurrentDate() { document.getElementById('current-date').textContent = new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
    
    switchView(viewId) {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === viewId));
        document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === `${viewId}-view`));
        if (viewId === 'admin') this.updateAdminUI();
    }

    updateHistoryUI() {
        const list = document.getElementById('history-list');
        list.innerHTML = this.state.logs.map(l => `
            <div class="history-item glass">
                <div class="h-info">
                    <div class="h-date">${new Date(l.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</div>
                    <div class="h-time">${l.start} - ${l.end} ${l.lat ? `<span class="geo-tag">📍</span>` : ''}</div>
                </div>
                <div class="h-duration">${l.duration}</div>
            </div>
        `).join('');
    }

    updateAdminUI() {
        const list = document.getElementById('employee-list');
        const employees = [
            { name: 'สมชาย วิริยะ', status: 'In', time: '08:45', avatar: '1' },
            { name: 'วิภา สายชาร์จ', status: 'In', time: '09:02', avatar: '2' },
            { name: 'มานะ อดทน', status: 'Out', time: '17:30', avatar: '3' },
            { name: 'กิตติ ใจดี', status: 'In', time: '08:50', avatar: '4' }
        ];
        list.innerHTML = employees.map(emp => `
            <div class="employee-card glass">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emp${emp.avatar}" class="emp-avatar">
                <div class="emp-info">
                    <div class="emp-name">${emp.name}</div>
                    <div class="emp-status">เข้างานเมื่อ ${emp.time}</div>
                </div>
                <div class="status-badge ${emp.status.toLowerCase()}">${emp.status}</div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => window.app = new ZenTimeApp());
