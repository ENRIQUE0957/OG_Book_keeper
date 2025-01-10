import { currentUser } from "../controller/firebase_auth.js";
import { root } from "./elements.js";
import { protectedView } from "./protected_view.js";
import { onSubmitCreateForm, onClickExpandButton, onKeyDownNewItemInput, onMouseOverItem, onMouseOutItem, onKeyDownUpdateItem } from "../controller/home_controller.js";
import { getToDoTitleList } from "../controller/firestore_controller.js";
import { DEV } from "../model/constants.js";



let pieChart;

export async function homePageView() {
    if (!currentUser) {
        root.innerHTML = await protectedView();
        return;
    }

    const response = await fetch('/view/templates/home_page_template.html', { cache: 'no-store' });
    const divWrapper = document.createElement('div');
    divWrapper.innerHTML = await response.text();
    divWrapper.classList.add('m-4', 'p-4');

    // Planner Overview Layout
    const plannerOverview = document.createElement('div');
    plannerOverview.classList.add('planner-overview', 'row');

    // Upcoming Charges Section

    
    const upcomingChargesSection = document.createElement('div');
upcomingChargesSection.classList.add(
    'col-md-8',
    'upcoming-charges-section',
    'rounded',
    'p-3',
    'shadow-lg',
    'bg-light',
    'mt-3'
);
upcomingChargesSection.innerHTML = `
    <h3 style="
        color: rgba(255, 255, 255, 0.8); 
        font-weight: bold; 
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); 
        background: linear-gradient(145deg, rgba(40, 167, 69, 0.8), rgba(33, 136, 56, 0.8)); 
        -webkit-background-clip: text; 
        background-clip: text; 
        -webkit-text-fill-color: transparent; 
        text-align: center; 
        margin-bottom: 1.5rem;">
        Upcoming Charges
    </h3>
    <ul id="upcoming-charges-list" class="list-group" style="padding: 0; margin: 0;">
        <li class="list-group-item d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 rounded" 
            style="
                background: linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05)); 
                backdrop-filter: blur(10px); 
                border: 1px solid rgba(255, 255, 255, 0.3); 
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
                transition: all 0.3s ease-in-out;">
            <span class="d-flex align-items-center">
                <img src="path/to/discovery-logo.png" alt="Discovery" style="width: 24px; height: 24px; margin-right: 10px;">
                <strong style="color: rgba(255, 255, 255, 0.9);">Discovery Card</strong>
            </span>
            <span class="badge bg-success text-white" style="font-size: 1.1rem;">$55</span>
            <button class="btn btn-danger btn-sm ml-2 delete-bill shadow-sm" style="font-weight: bold;">Remove</button>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 rounded" 
            style="
                background: linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05)); 
                backdrop-filter: blur(10px); 
                border: 1px solid rgba(255, 255, 255, 0.3); 
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
                transition: all 0.3s ease-in-out;">
            <span class="d-flex align-items-center">
                <img src="path/to/visa-logo.png" alt="Visa" style="width: 24px; height: 24px; margin-right: 10px;">
                <strong style="color: rgba(255, 255, 255, 0.9);">Visa Card</strong>
            </span>
            <span class="badge bg-success text-white" style="font-size: 1.1rem;">$120</span>
            <button class="btn btn-danger btn-sm ml-2 delete-bill shadow-sm" style="font-weight: bold;">Remove</button>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 rounded" 
            style="
                background: linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05)); 
                backdrop-filter: blur(10px); 
                border: 1px solid rgba(255, 255, 255, 0.3); 
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
                transition: all 0.3s ease-in-out;">
            <span class="d-flex align-items-center">
                <img src="path/to/mastercard-logo.png" alt="MasterCard" style="width: 24px; height: 24px; margin-right: 10px;">
                <strong style="color: rgba(255, 255, 255, 0.9);">MasterCard</strong>
            </span>
            <span class="badge bg-success text-white" style="font-size: 1.1rem;">$75</span>
            <button class="btn btn-danger btn-sm ml-2 delete-bill shadow-sm" style="font-weight: bold;">Remove</button>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 rounded" 
            style="
                background: linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05)); 
                backdrop-filter: blur(10px); 
                border: 1px solid rgba(255, 255, 255, 0.3); 
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
                transition: all 0.3s ease-in-out;">
            <span class="d-flex align-items-center">
                <img src="path/to/amex-logo.png" alt="Amex" style="width: 24px; height: 24px; margin-right: 10px;">
                <strong style="color: rgba(255, 255, 255, 0.9);">Amex Card</strong>
            </span>
            <span class="badge bg-success text-white" style="font-size: 1.1rem;">$200</span>
            <button class="btn btn-danger btn-sm ml-2 delete-bill shadow-sm" style="font-weight: bold;">Remove</button>
        </li>
    </ul>
    <div class="mt-4 text-end" style="
        background: linear-gradient(to right, rgba(40, 167, 69, 0.9), rgba(33, 136, 56, 0.9)); 
        padding: 15px; 
        border-radius: 10px; 
        color: white;">
        <h5 style="margin: 0; font-size: 1.3rem;">Total Money Needed: <span id="total-money-needed">$450</span></h5>
    </div>
`;


    // Right Column for Pie Chart, Calendar, Notes, and Bills
    const rightColumn = document.createElement('div');
    rightColumn.classList.add('col-md-4', 'd-flex', 'flex-column');

    // Pie Chart Section
    const pieChartSection = document.createElement('div');
    pieChartSection.classList.add('pie-chart-section', 'rounded', 'p-3', 'shadow-lg', 'bg-light', 'mb-3');
    pieChartSection.classList.add(
        'pie-chart-section',
        'rounded',
        'p-3',
        'shadow-lg',
        'bg-light',
        'mb-3'
    );
    pieChartSection.innerHTML = `
        <h3 style="color: green;">Monthly Expenses</h3>
        <div style="width: 100%; height: 200px;">
            <canvas id="pie-chart" style="width: 100%; height: 100%; border-radius: 50%; background: linear-gradient(to bottom, #fff, #ddd); box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></canvas>
        </div>
        <p style="color: black; font-weight: bold;">Total Needed: <span id="total-needed" style="color: green;">$0</span></p>
    `;
    // Calendar Section
    const calendarSection = document.createElement('div');
    calendarSection.classList.add('calendar-section', 'rounded', 'p-3', 'shadow-lg', 'bg-light', 'mb-3');
    calendarSection.innerHTML = `
        <h3 style="color: green;">Calendar</h3>
        <div id="calendar" style="width: 100%; height: 200px; background: #fff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></div>
    ;`

    // Notes Section
    const notesSection = document.createElement('div');
    notesSection.classList.add('notes-section', 'rounded', 'p-3', 'shadow-lg', 'bg-light', 'mb-3');
    notesSection.innerHTML = `
        <h3 style="color: green;">Create a Note</h3>
        <form id="create-note-form">
            <label for="new-note-title" style="color: black; font-weight: bold;">New Note Title:</label>
            <input type="text" id="new-note-title" class="form-control" placeholder="Enter note title" style="border: 2px solid green; border-radius: 5px;">
            <button type="submit" class="btn btn-success mt-2" style="background: green; border: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Create</button>
        </form>
        <div id="todo-container" class="mt-3"></div>
    ;
    `
    // Bills Section
    const billsSection = document.createElement('div');
    billsSection.classList.add('bills-section', 'rounded', 'p-3', 'shadow-lg', 'bg-light', 'mb-3');
    billsSection.innerHTML = `
        <h3 style="color: green;">Add a Bill</h3>
        <form id="add-bill-form">
            <label for="bill-name" style="color: black; font-weight: bold;">Bill Name:</label>
            <input type="text" id="bill-name" class="form-control" placeholder="Enter bill name" style="border: 2px solid green; border-radius: 5px;" required>
            <label for="bill-amount" style="color: black; font-weight: bold;">Amount:</label>
            <input type="number" id="bill-amount" class="form-control" placeholder="Enter amount" style="border: 2px solid green; border-radius: 5px;" required>
            <label for="bill-date" style="color: black; font-weight: bold;">Due Date:</label>
            <input type="date" id="bill-date" class="form-control" style="border: 2px solid green; border-radius: 5px;" required>
            <label for="bill-category" style="color: black; font-weight: bold;">Category:</label>
            <select id="bill-category" class="form-control" style="border: 2px solid green; border-radius: 5px;" required>
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Groceries">Groceries</option>
                <option value="Car">Car</option>
                <option value="Other">Other</option>
            </select>
            <button type="submit" class="btn btn-success mt-2" style="background: green; border: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Add Bill</button>
        </form>
        <ul id="bills-list" class="mt-3 list-group"></ul>
    ;`

    // Append Pie Chart, Calendar, Notes, and Bills to the right column
    rightColumn.appendChild(pieChartSection);
    rightColumn.appendChild(calendarSection);
   // rightColumn.appendChild(notesSection);
    rightColumn.appendChild(billsSection);

    // Append Sections to Overview
    plannerOverview.appendChild(upcomingChargesSection);
    plannerOverview.appendChild(rightColumn);

    root.innerHTML = '';
    root.appendChild(plannerOverview);

    // Setup Components
    setupPieChart();
    setupCalendar();
  //  setupNotes();
    setupBills();
}

function setupPieChart() {
    const pieChartCanvas = document.getElementById("pie-chart");

    if (pieChartCanvas) {
        const ctx = pieChartCanvas.getContext('2d');
        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Rent', 'Utilities', 'Groceries', 'Car', 'Other'],
                datasets: [{
                    data: [0, 0, 0, 0, 0], // Initial data
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] // Colors for each category
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': $' + tooltipItem.raw;
                            }
                        }
                    }
                }
            }
        });

        const totalNeeded = document.getElementById("total-needed");
        totalNeeded.textContent = "$0";

        //add double click functionality 
        pieChartCanvas.ondblclick = function(){
            console.log("pie chart clicked");
            showModal('pie-chart');
        };
    } else {
        console.error("Pie chart canvas element not found");
    }
}

function setupCalendar() {
    const calendarEl = document.getElementById("calendar");

    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: [
                {
                    title: 'Event 1',
                    start: '2023-10-01'
                },
                {
                    title: 'Event 2',
                    start: '2023-10-05',
                    end: '2023-10-07'
                }
            ],
            dateClick: function(info) {
                const title = prompt('Enter a title for this event:');
                if (title) {
                    calendar.addEvent({
                        title: title,
                        start: info.dateStr,
                        allDay: true
                    });
                }
            },
            eventClick: function(info) {
                const newTitle = prompt('Edit event title:', info.event.title);
                if (newTitle !== null) {
                    info.event.setProp('title', newTitle);
                }
            }
        });
        setTimeout(() => {calendar.render();}, 0);//esure rendering 

        calendar.render();
        //double click functionlaity becsue the calender is a bit too small 
        calendarEl.ondblclick = function(){
            showModal('calendar')
        };
    } else {
        console.error("Calendar element not found");
    }
}
function showModal(contentType) {
    const zoomedContent = document.getElementById("zoomedContent");
    zoomedContent.innerHTML = ""; // Clear previous content

    if (contentType === "calendar") {
        const calendarClone = document.createElement("div");
        calendarClone.id = "zoomedCalendar"; // Unique ID for zoomed styling
        zoomedContent.appendChild(calendarClone);

        // Initialize FullCalendar
        const zoomedCalendar = new FullCalendar.Calendar(calendarClone, {
            initialView: "dayGridMonth",
            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
            },
            events: [ // Example events, adjust or pass dynamically
                {
                    title: "Event 1",
                    start: "2023-10-01",
                },
                {
                    title: "Event 2",
                    start: "2023-10-05",
                    end: "2023-10-07",
                },
            ],
        });

        // Ensure the calendar renders
        setTimeout(() => {
            zoomedCalendar.render();
        }, 0);
    } else if (contentType === "pie-chart") {
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        zoomedContent.appendChild(canvas);

        // Deep clone the chart's data and options to avoid shared references
        const clonedData = JSON.parse(JSON.stringify(pieChart.data));
        const clonedOptions = JSON.parse(JSON.stringify(pieChart.options));

        new Chart(canvas, {
            type: "pie",
            data: clonedData,
            options: clonedOptions,
        });
    }

    const modal = new bootstrap.Modal(document.getElementById("zoomModal"));
    modal.show();
}



/*
async function setupNotes() {
    const todoContainer = document.getElementById("todo-container");
    let toDoTitlelList = '';
    try {
        toDoTitlelList = await getToDoTitleList(currentUser.uid);
    } catch (e) {
        if (DEV) console.log('failed to get title list', e);
        alert('Failed to get title list: ' + JSON.stringify(e));
        return;
    }

    toDoTitlelList.forEach(title => {
        todoContainer.appendChild(buildCard(title));
    });

    const form = document.getElementById("create-note-form");
    form.onsubmit = onSubmitCreateForm;
}
    */

/*
function setupBills() {
    const form = document.getElementById("add-bill-form");
    form.onsubmit = function (e) {
        e.preventDefault();
        const billName = document.getElementById('bill-name').value;
        const billAmount = document.getElementById('bill-amount').value;
        const billDate = document.getElementById('bill-date').value;
        const billCategory = document.getElementById('bill-category').value;

        const billItem = document.createElement('li');
        billItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        billItem.innerHTML = 
            <span>${billName}</span>
            <span>$${billAmount} due on ${billDate}</span>
            <button class="btn btn-danger btn-sm ml-2 delete-bill">X</button>
        ;
        document.getElementById('bills-list').appendChild(billItem);

        // Also add to upcoming charges list
        const upcomingChargesItem = document.createElement('li');
        upcomingChargesItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        upcomingChargesItem.innerHTML = 
            <span>${billName}</span>
            <span>$${billAmount}</span>
            <button class="btn btn-danger btn-sm ml-2 delete-bill">X</button>
        ;
        document.getElementById('upcoming-charges-list').appendChild(upcomingChargesItem);

        // Update pie chart
        updatePieChart(billCategory, billAmount);

        // Add event listener to delete buttons
        addDeleteEventListeners();

        // Clear form
        e.target.reset();
    };

    // Add event listener to existing delete buttons
    addDeleteEventListeners();
}
    */
function setupBills() {
    const form = document.getElementById("add-bill-form");
    form.onsubmit = function (e) {
      e.preventDefault();
      const billName = document.getElementById('bill-name').value;
      const billAmount = document.getElementById('bill-amount').value;
      const billDate = document.getElementById('bill-date').value;
      const billCategory = document.getElementById('bill-category').value;
  
      const billItem = document.createElement('li');
        billItem.classList.add(
            'list-group-item',
            'd-flex',
            'justify-content-between',
            'align-items-center',
            'shadow-sm',
            'p-3',
            'mb-3',
            'rounded'
        );
        billItem.style = `
            background: linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05)); 
            backdrop-filter: blur(10px); 
            border: 1px solid rgba(255, 255, 255, 0.3); 
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
            transition: all 0.3s ease-in-out;
        `;
        billItem.innerHTML = `
            <span class="d-flex align-items-center">
                <img src="path/to/default-logo.png" alt="${billName}" style="width: 24px; height: 24px; margin-right: 10px;">
                <strong style="color: rgba(255, 255, 255, 0.9);">${billName}</strong>
            </span>
            <span class="badge bg-success text-white" style="font-size: 1.1rem;">$${billAmount}</span>
            <button class="btn btn-danger btn-sm ml-2 delete-bill shadow-sm" style="font-weight: bold;">Remove</button>
        `;
         // Add to Bills List
         const billsList = document.getElementById('bills-list');
         if (billsList) {
             billsList.appendChild(billItem);
             
            

         } else {
             console.error("Element with id 'bills-list' not found.");
         }



  
      // Also add to upcoming charges list
     // Add to Upcoming Charges List
     const upcomingChargesList = document.getElementById('upcoming-charges-list');
     if (upcomingChargesList) {
         const upcomingChargesItem = billItem.cloneNode(true);
         upcomingChargesList.appendChild(upcomingChargesItem);
     } else {
         console.error("Element with id 'upcoming-charges-list' not found.");
     }
  
      // Add delete functionality immediately
      addDeleteEventListeners();
  
      // Update pie chart
      updatePieChart(billCategory, billAmount);
  
      // Clear form
      e.target.reset();
    };
  
    // Ensure delete listeners are applied to existing items
    addDeleteEventListeners();
  }
  
/*
function updatePieChart(category, amount) {
    const categoryIndex = pieChart.data.labels.indexOf(category);
    if (categoryIndex !== -1) {
        pieChart.data.datasets[0].data[categoryIndex] += parseFloat(amount);
        pieChart.update();
    }
}
*/
/*
function updatePieChart(category,amount){
    const categoryIndex = pieChart.data.label.indexOf(category);
    if(categoryIndex !== -1){
        pieChart.data.datasets[0].data[categoryIndex]+= parseFloat(amount);
        pieChart.update();
    

      // Update the total needed box
      const totalNeeded = document.getElementById("total-needed");
      const currentTotal = parseFloat(totalNeeded.textContent.replace('$', '')) || 0;
      totalNeeded.textContent = "$" + (currentTotal + parseFloat(amount)).toFixed(2);
  }
}
  */
function updatePieChart(category, amount) {
    const categoryIndex = pieChart.data.labels.indexOf(category);
    if (categoryIndex !== -1) {
      pieChart.data.datasets[0].data[categoryIndex] += parseFloat(amount);
      pieChart.update();
  
      // Update the total needed box
      const totalNeeded = document.getElementById("total-needed");
      const currentTotal = parseFloat(totalNeeded.textContent.replace('$', '')) || 0;
      totalNeeded.textContent = `$${(currentTotal + parseFloat(amount)).toFixed(2)}`;
    }
  }
/*
function addDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-bill');
    deleteButtons.forEach(button => {
        button.onclick = function () {
            const billItem = button.parentElement;
            const billName = billItem.querySelector('span').textContent;

            // Remove from bills list
            billItem.remove();

            // Remove from upcoming charges list
            const upcomingChargesItems = document.querySelectorAll('#upcoming-charges-list .list-group-item');
            upcomingChargesItems.forEach(item => {
                if (item.querySelector('span').textContent === billName) {
                    item.remove();
                }
            });

            // Update pie chart
            const billCategory = billItem.querySelector('select').value;
            const billAmount = parseFloat(billItem.querySelector('span').textContent.replace('$', ''));
            updatePieChart(billCategory, -billAmount);
        };
    });
}
*/
function addDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-bill');
    deleteButtons.forEach(button => {
      button.onclick = function () {
        const billItem = button.parentElement;
        const billAmount = parseFloat(billItem.querySelector('span:nth-child(2)').textContent.replace('$', '').split(' ')[0]);
        const billCategory = "Other"; // You may adjust this based on your data source
  
        // Remove from bills list
        billItem.remove();
  
        // Remove from upcoming charges list
        const upcomingChargesItems = document.querySelectorAll('#upcoming-charges-list .list-group-item');
        upcomingChargesItems.forEach(item => {
          if (item.querySelector('span').textContent === billItem.querySelector('span').textContent) {
            item.remove();
          }
        });
  
        // Update pie chart
        updatePieChart(billCategory, -billAmount);
      };
    });
  }

export function buildCard(todoTitle) {
    const div = document.createElement('div');
    div.classList.add('card', 'd-inline-block', 'shadow', 'rounded');
    div.style = "width: 25rem; transition: transform 0.2s; background: linear-gradient(to bottom, #fff, #ddd); box-shadow: 0 4px 6px rgba(0,0,0,0.1);";
    div.innerHTML = `
        <div id="${todoTitle.docId}" class="card-body" style="padding: 15px;">
            <button class="btn btn-outline-success" style="border: 2px solid green; border-radius: 5px;">+</button>
            <span class="fs-3 card-title" style="color: black;">${todoTitle.title}</span>
        </div>
    ;`

    const expandButton = div.querySelector('button');
    expandButton.onclick = onClickExpandButton;

    div.onmouseover = () => {
        div.style.transform = "scale(1.05)";
        div.style.boxShadow = "0 8px 12px rgba(0,0,0,0.2)";
    };
    div.onmouseout = () => {
        div.style.transform = "scale(1)";
        div.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    };

    return div;
}

export function buildCardText(titleDocId, itemList) {
    const p = document.createElement('p');
    p.classList.add('card-text', 'd-block');
    const ul = document.createElement('ul');
    p.appendChild(ul);

    if (itemList.length != 0) {
        itemList.forEach(item => {
            ul.appendChild(createToDoItemElement(item));
        });
    }

    const newItemInput = document.createElement('input');
    newItemInput.size = "40";
    newItemInput.id = "input" + titleDocId;
    newItemInput.placeholder = "Enter an item";
    newItemInput.style = "border: 2px solid green; border-radius: 5px;";
    newItemInput.onkeydown = function (e) {
        onKeyDownNewItemInput(e, titleDocId);
    };
    p.appendChild(newItemInput);

    return p;
}

export function createToDoItemElement(item) {
    const li = document.createElement('li');
    li.id = item.docId;
    li.innerHTML = `
        <span class="d-block" style="color: black;">${item.content}</span>
        <input class="d-none" type="text" value="${item.content}" style="border: 2px solid green; border-radius: 5px;">
    ;`
    li.onmouseover = onMouseOverItem;
    li.onmouseout = onMouseOutItem;
    const input = li.querySelector('input');
    input.onkeydown = onKeyDownUpdateItem;
    return li;
}