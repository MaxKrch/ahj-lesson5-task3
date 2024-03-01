import moment from "moment";

export default class Calendar {
	constructor(widget) {
		this.widget = widget;

		this.navigation = {};
		this.month;
		this.calendar;
		this.calendarContainer;

		this.dates = [];
		this.selectedDate = {
			there: null,
			back: null,
		};

		this.clickCalendarListeners = [];
		this.clickNavigationLeftListeners = [];
		this.clickNavigationRightListeners = [];

		this.init();
	}

	init() {
		this.createArrayDates();
		this.renderCalendarPage();
		this.renderStartingCalendar();
		this.registerEventListeners();
	}

	registerEventListeners() {
		this.calendar.addEventListener("click", (event) => {
			this.clickCalendarListeners.forEach((item) => item(event));
		});
		this.navigation.left.addEventListener("click", (event) => {
			this.clickNavigationLeftListeners.forEach((item) => item(event));
		});
		this.navigation.right.addEventListener("click", (event) => {
			this.clickNavigationRightListeners.forEach((item) => item(event));
		});
	}

	createArrayDates() {
		const startOfMonth = moment().startOf("month");
		const startOfWeek = moment(startOfMonth).startOf("week").add(1, "days");

		this.updateArrayDates(startOfWeek);
	}

	updateArrayDates(firstDate) {
		this.dates = [];

		for (let i = 0; i < 42; i += 1) {
			const clone = firstDate.clone();
			const newDate = clone.add(i, "days").format("L");
			this.dates.push(newDate);
		}
	}

	renderCalendarPage() {
		const calendarContainer = document.createElement("div");
		calendarContainer.classList.add("calendar-container", "hidden-item");
		const calendar = this.renderCalendar();

		calendarContainer.append(calendar);

		this.calendarContainer = calendarContainer;
		this.widget.append(calendarContainer);
	}

	renderStartingCalendar() {
		const month = moment().locale("ru").format("MMM YYYY");
		this.renderCalendarMonth(month);
		this.renderCalendarDates();
	}

	renderCalendar() {
		const calendar = document.createElement("div");
		calendar.classList.add("calendar");

		const calendarHeader = this.renderCalendarHeader();
		calendar.append(calendarHeader);

		const calendarBody = this.renderCalendarBody();
		calendar.append(calendarBody);

		return calendar;
	}

	renderCalendarHeader() {
		const calendarHeader = document.createElement("div");
		calendarHeader.classList.add("calendar-header");
		calendarHeader.innerHTML = `
			<p class="calendar-header-navigation calendar-header-navigation-left calendar-header-navigation-passive">
					&#8249;
				</p>
				
				<p class="calendar-header-month">
				</p>
						
				<p class="calendar-header-navigation calendar-header-navigation-right calendar-header-navigation-active">
					&#8250;
				</p>
		`;

		this.saveElementHeaderCalendar(calendarHeader);

		return calendarHeader;
	}

	saveElementHeaderCalendar(calendarHeader) {
		this.navigation.left = calendarHeader.querySelector(".calendar-header-navigation-left");
		this.navigation.right = calendarHeader.querySelector(".calendar-header-navigation-right");
		this.month = calendarHeader.querySelector(".calendar-header-month");
	}

	renderCalendarBody() {
		const calendarBody = document.createElement("table");
		calendarBody.classList.add("calendar-body");
		calendarBody.dataset.direction = "there";

		this.calendar = calendarBody;
		return calendarBody;
	}

	renderCalendarDaysOfWeek() {
		const daysOfWeek = document.createElement("tr");
		daysOfWeek.classList.add("calendar-body-tr", "calendar-body-days");
		const monday = moment().startOf("week");

		for (let i = 1; i <= 7; i += 1) {
			const clone = monday.clone();
			const day = clone.add(i, "days").locale("ru").format("dd");
			const cellWithDay = this.renderCalendarTh(day);

			if (i > 5) {
				cellWithDay.classList.add("calendar-dayOff");
			}

			daysOfWeek.append(cellWithDay);
		}

		return daysOfWeek;
	}

	renderCalendarMonth(month) {
		this.month.textContent = month;
	}

	renderCalendarDates() {
		this.calendar.innerHTML = "";

		const daysOfWeek = this.renderCalendarDaysOfWeek();
		this.calendar.append(daysOfWeek);

		for (let startInd = 0; startInd < 42; startInd += 7) {
			const currentWeek = this.dates.slice(startInd, startInd + 7);
			this.renderCalendarTr(currentWeek, startInd);
		}
	}

	renderCalendarTr(week, startInd) {
		const row = document.createElement("tr");
		row.classList.add("calendar-body-tr", "calendar-body-dates");

		for (let i = 0; i < 7; i += 1) {
			const date = week[i];
			const index = i + startInd;

			const cellWithDate = this.renderCalendarTd(date, index);

			row.append(cellWithDate);
		}

		this.calendar.append(row);
	}

	renderCalendarTh(day) {
		const cell = document.createElement("th");
		cell.classList.add("calendar-body-td", "calendar-body-day");
		cell.textContent = day;

		return cell;
	}

	renderCalendarTd(date, index) {
		const cell = document.createElement("td");
		cell.classList.add("calendar-body-date", "calendar-body-td");
		cell.dataset.id = index;
		cell.textContent = moment(date).locale("ru").format("DD");

		if (moment(date).locale("ru").format("dd") === "сб" || moment(date).locale("ru").format("dd") === "вс") {
			cell.classList.add("calendar-dayOff");
		}

		if (moment().isSame(date, "day")) {
			cell.classList.add("calendar-body-today");
		}

		if (!moment().isSame(date, "month")) {
			cell.classList.add("calendar-body-date-othermonth");
		}

		if (moment().isSameOrAfter(date, "day")) {
			cell.classList.add("calendar-body-date-passive");
		}

		if (this.calendar.dataset.direction === "there") {
			if (this.selectedDate.there && moment(date).isSame(this.selectedDate.there, "day")) {
				cell.classList.add("calendar-body-date-selected");
			}
		}

		if (this.calendar.dataset.direction === "back") {
			if (this.selectedDate.back && moment(date).isSame(this.selectedDate.back, "day")) {
				cell.classList.add("calendar-body-date-selected");
			}

			if (this.selectedDate.there && moment(this.selectedDate.there).isAfter(date)) {
				cell.classList.add("calendar-body-date-passive");
			}
		}
		return cell;
	}

	addClickCalendarListeners(callback) {
		this.clickCalendarListeners.push(callback);
	}
	addClickNavigationLeftListeners(callback) {
		this.clickNavigationLeftListeners.push(callback);
	}
	addClickNavigationRightListeners(callback) {
		this.clickNavigationRightListeners.push(callback);
	}

	clearCalendar() {
		this.selectedDate = {
			there: null,
			back: null,
		};
		this.createArrayDates();
		this.renderStartingCalendar();
	}

	clearDirectionBack() {
		this.selectedDate.back = null;
	}

	showCalendar(direction, event) {
		this.calendar.dataset.direction = direction;
		// this.removeSelectionDate();

		// if(event.target.dataset.id) {
		// 	this.showDate(event.target.dataset.id)
		// }

		this.renderCalendarDates();

		this.calendarContainer.classList.remove("hidden-item");
		const positionCeilBlock = event.target.getBoundingClientRect();
		const top = positionCeilBlock.bottom + window.pageYOffset;

		this.calendarContainer.style.top = `${top}px`;

		let left = 20 + window.pageXOffset;

		if (direction === "back") {
			left = left + positionCeilBlock.width * 2 - this.calendarContainer.getBoundingClientRect().width;
		}

		this.calendarContainer.style.left = `${left}px`;
	}

	dateSelection(cell) {
		const direction = this.calendar.dataset.direction;
		const index = cell.dataset.id;
		const date = this.dates[index];

		this.selectedDate[direction] = date;
		if (direction === "there" && moment(this.selectedDate.there).isAfter(this.selectedDate.back)) {
			this.selectedDate.back = null;
			console.log(this.selectedDate);
		}
		this.removeSelectionDate();

		cell.classList.add("calendar-body-date-selected");

		this.hideCalendar();
	}

	removeSelectionDate() {
		const oldDate = this.calendar.querySelector(".calendar-body-date-selected");
		if (oldDate) {
			oldDate.classList.remove("calendar-body-date-selected");
		}
	}

	hideCalendar() {
		this.calendarContainer.classList.add("hidden-item");
	}

	flipCalendar(flip) {
		const oldMonth = this.month.textContent;
		const month = moment(oldMonth, "MMM YYYY", "ru");
		const newMonth = month.add(flip, "months");
		const startOfMonth = moment(newMonth).startOf("month").locale("en");
		const startOfWeek = moment(startOfMonth).startOf("week").add(1, "days");

		this.updateArrayDates(startOfWeek);

		const formatNewMonth = newMonth.locale("ru").format("MMM YYYY");
		this.renderCalendarMonth(formatNewMonth);

		this.renderCalendarDates();

		if (flip > 0) {
			this.navigation.left.classList.remove("calendar-header-navigation-passive");
		}

		if (flip < 0 && moment().isSame(newMonth, "months")) {
			this.navigation.left.classList.add("calendar-header-navigation-passive");
		}
	}
}
