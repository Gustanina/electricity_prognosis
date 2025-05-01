
console.log('✅ index.js loaded at', new Date().toISOString());

const entsoeChart = document.getElementById('entsoe-chart');
const entsoeTable = document.getElementById('entsoe-table');

/*
const totalViewChart = document.getElementById('total-views-chart');
const revenueChart = document.getElementById('revenue-chart');
const growthRateChart = document.getElementById('growth-rate-chart');
const subscriberCountChart = document.getElementById('subscriber-count-chart');



fetch('/api/total-views')
.then(response => response.json())
.then(data => 
    new Chart(totalViewChart,{
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Kaina $',
                data: data.data,
                borderWidth: 1
        }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    
    })
)

const estimatedRevenueChart = new Chart(revenueChart,{
    type: 'line',
    data: {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
            label: 'Kaina $',
            data: [50, 12, 16, 20, 24, 28],
            borderWidth: 1
    }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }

})


const estimatedGrothChart = new Chart(growthRateChart,{
    type: 'line',
    data: {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
            label: 'Kiekis $',
            data: [10, 12, 16, 200, 24, 100],
            borderWidth: 1
    }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }

})


const subscriberCount = new Chart(subscriberCountChart,{
    type: 'line',
    data: {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
            label: 'Subscribers',
            data: [5, 10, 15, 20, 25, 30], 
            borderWidth: 1
    }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
*/

fetch('/api/prices')
  .then(res => {
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json(); // returns [ { timestamp, price }, … ]
  })
  .then(raw => {
    // 1) Map timestamps → human-readable labels
    const labels = raw.map(item => {
      const d = new Date(item.timestamp);
      // adjust formatting as you like:
      return d.toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' });
    });

    // 2) Map prices → data points
    const data = raw.map(item => item.price);

    // 3) Instantiate the chart
    new Chart(document.getElementById('entsoe-chart'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Kaina €',
          data,
          borderWidth: 1,
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        },
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  })
  .catch(err => console.error('❌ /api/prices failed:', err));


  // Čia yra problema dėl data table pykstasi kažkodėl su chart.js (vienu žodžiu čia skill issue buvo)

// Inside your DOMContentLoaded (or after the DOM is ready):
fetch('/api/prices')
  .then(res => {
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();  // returns [ { timestamp, price }, … ]
  })
  .then(raw => {
    // build table rows: [ [formattedDate, price], … ]
    const rows = raw.map(item => {
      const d = new Date(item.timestamp);
      // e.g. “2025-04-29 03:00”
      const date = d.toLocaleString('lt-LT', {
        year:   'numeric',
        month:  '2-digit',
        day:    '2-digit',
        hour:   '2-digit',
        minute: '2-digit'
      });
      return [ date, item.price ];
    });

    // initialize the DataTable with headings + your rows
    new simpleDatatables.DataTable('#entsoe-table', {
      searchable: true,
      fixedHeight: true,
      data: {
        headings: ['Data', 'Kaina'],
        data:     rows
      }
    });
  })
  .catch(err => console.error('❌ entsoe-table failed:', err));
