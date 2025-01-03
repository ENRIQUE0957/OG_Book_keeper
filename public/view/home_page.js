import { currentUser } from "../controller/firebase_auth.js";
import { root } from "./elements.js";
import { protectedView } from "./protected_view.js";
import { onSubmitCreateForm, onClickExpandButton, onKeyDownNewItemInput, onMouseOverItem, onMouseOutItem, onKeyDownUpdateItem } from "../controller/home_controller.js";
import { getToDoTitleList } from "../controller/firestore_controller.js";
import { DEV } from "../model/constants.js";

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
    upcomingChargesSection.classList.add('col-md-8', 'upcoming-charges-section', 'rounded', 'p-3', 'shadow-lg', 'bg-light', 'mt-3');
    upcomingChargesSection.innerHTML = `
        <h3 style="color: green;">Upcoming Charges</h3>
        <ul id="upcoming-charges-list" class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="path/to/discovery-logo.png" alt="Discovery" style="width: 20px; height: 20px;"> Discovery Card</span>
                <span>$55</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="path/to/visa-logo.png" alt="Visa" style="width: 20px; height: 20px;"> Visa Card</span>
                <span>$120</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="path/to/mastercard-logo.png" alt="MasterCard" style="width: 20px; height: 20px;"> MasterCard</span>
                <span>$75</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="path/to/amex-logo.png" alt="Amex" style="width: 20px; height: 20px;"> Amex Card</span>
                <span>$200</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="path/to/discovery-logo.png" alt="Discovery" style="width: 20px; height: 20px;"> Discovery Card</span>
                <span>$55</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="path/to/visa-logo.png" alt="Visa" style="width: 20px; height: 20px;"> Visa Card</span>
                <span>$120</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="path/to/mastercard-logo.png" alt="MasterCard" style="width: 20px; height: 20px;"> MasterCard</span>
                <span>$75</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="path/to/amex-logo.png" alt="Amex" style="width: 20px; height: 20px;"> Amex Card</span>
                <span>$200</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="path/to/discovery-logo.png" alt="Discovery" style="width: 20px; height: 20px;"> Discovery Card</span>
                <span>$55</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="path/to/visa-logo.png" alt="Visa" style="width: 20px; height: 20px;"> Visa Card</span>
                <span>$120</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="path/to/mastercard-logo.png" alt="MasterCard" style="width: 20px; height: 20px;"> MasterCard</span>
                <span>$75</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><img src="path/to/amex-logo.png" alt="Amex" style="width: 20px; height: 20px;"> Amex Card</span>
                <span>$200</span>
            </li>
        </ul>
    `;

    // Right Column for Pie Chart, Calendar, and Notes
    const rightColumn = document.createElement('div');
    rightColumn.classList.add('col-md-4', 'd-flex', 'flex-column');

    // Pie Chart Section
    const pieChartSection = document.createElement('div');
    pieChartSection.classList.add('pie-chart-section', 'rounded', 'p-3', 'shadow-lg', 'bg-light', 'mb-3');
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
    `;

    // Notes Section
    const notesSection = document.createElement('div');
    notesSection.classList.add('notes-section', 'rounded', 'p-3', 'shadow-lg', 'bg-light');
    notesSection.innerHTML = `
        <h3 style="color: green;">Create a Note</h3>
        <form id="create-note-form">
            <label for="new-note-title" style="color: black; font-weight: bold;">New Note Title:</label>
            <input type="text" id="new-note-title" class="form-control" placeholder="Enter note title" style="border: 2px solid green; border-radius: 5px;">
            <button type="submit" class="btn btn-success mt-2" style="background: green; border: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Create</button>
        </form>
        <div id="todo-container" class="mt-3"></div>
    `;

    // Append Pie Chart, Calendar, and Notes to the right column
    rightColumn.appendChild(pieChartSection);
    rightColumn.appendChild(calendarSection);
    rightColumn.appendChild(notesSection);

    // Append Sections to Overview
    plannerOverview.appendChild(upcomingChargesSection);
    plannerOverview.appendChild(rightColumn);

    root.innerHTML = '';
    root.appendChild(plannerOverview);

    // Setup Components
    setupPieChart();
    setupCalendar();
    setupNotes();
}

function setupPieChart() {
    const pieChartCanvas = document.getElementById("pie-chart");

    if (pieChartCanvas) {
        const ctx = pieChartCanvas.getContext('2d');
        const pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Rent', 'Utilities', 'Groceries'],
                datasets: [{
                    data: [10, 20, 30], // Example data
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] // Example colors
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
        totalNeeded.textContent = "$2000";
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

        calendar.render();
    } else {
        console.error("Calendar element not found");
    }
}

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

export function buildCard(todoTitle) {
    const div = document.createElement('div');
    div.classList.add('card', 'd-inline-block', 'shadow', 'rounded');
    div.style = "width: 25rem; transition: transform 0.2s; background: linear-gradient(to bottom, #fff, #ddd); box-shadow: 0 4px 6px rgba(0,0,0,0.1);";
    div.innerHTML = `
        <div id="${todoTitle.docId}" class="card-body" style="padding: 15px;">
            <button class="btn btn-outline-success" style="border: 2px solid green; border-radius: 5px;">+</button>
            <span class="fs-3 card-title" style="color: black;">${todoTitle.title}</span>
        </div>
    `;

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
    `;
    li.onmouseover = onMouseOverItem;
    li.onmouseout = onMouseOutItem;
    const input = li.querySelector('input');
    input.onkeydown = onKeyDownUpdateItem;
    return li;
}