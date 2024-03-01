import RenderWidget from "./RenderWidget";
import Calendar from "./Calendar";

export default class TicketWidget {
	constructor(container) {
		this.widget = document.querySelector(container);

		this.render = new RenderWidget(this.widget);
		this.calendar = new Calendar(this.widget);
		this.init();
	}

	init() {
		this.addEventListeners();
	}

	addEventListeners() {
		this.render.addSubmitFormListeners(this.toSubmitFormListeners.bind(this));
		this.render.addClickDirectionsWhereListeners(this.toClickDirectionsWhereListeners.bind(this));
		this.render.addClickDirectionsFromWhereListeners(this.toClickDirectionsFromWhereListeners.bind(this));
		this.render.addClickDirectionsReverseListeners(this.toClickDirectionsReverseListeners.bind(this));
		this.render.addClickMembersAdultListeners(this.toClickMembersAdultListeners.bind(this));
		this.render.addClickMembersTeenListeners(this.toClickMembersTeenListeners.bind(this));
		this.render.addClickMembersChildListeners(this.toClickMembersChildListeners.bind(this));
		this.render.addClickRoundtripListeners(this.toClickRoundtripListeners.bind(this));
		this.render.addClickDatesThereListeners(this.toClickDatesThereListeners.bind(this));
		this.render.addClickDatesBackListeners(this.toClickDatesBackListeners.bind(this));

		this.calendar.addClickCalendarListeners(this.toClickCalendarListeners.bind(this));
		this.calendar.addClickNavigationLeftListeners(this.toClickNavigationLeftListeners.bind(this));
		this.calendar.addClickNavigationRightListeners(this.toClickNavigationRightListeners.bind(this));
	}

	toSubmitFormListeners() {
		const where = this.render.directions.where.value.trim();
		const fromwhere = this.render.directions.fromwhere.value.trim();

		if (where.length < 3 || fromwhere.length < 3) {
			this.render.showError("Напиши, куда и откуда летишь - и мы начнем поиск");
			setTimeout(() => {
				this.render.hideError();
			}, 3000);
			return;
		}

		if (!this.calendar.selectedDate.there) {
			this.render.showError("Выбери дату вылета");
			setTimeout(() => {
				this.render.hideError();
			}, 3000);
			return;
		}

		if (this.render.roundtrip.checked && !this.calendar.selectedDate.back) {
			this.render.showError("Отмени обратный рейс или укажи его дату");
			setTimeout(() => {
				this.render.hideError();
			}, 3000);
			return;
		}

		if (Number(this.render.members.adult.querySelector(".form-options-count").textContent) === 0) {
			this.render.showError("Нужно купить хотя бы один взрослый билет");
			setTimeout(() => {
				this.render.hideError();
			}, 3000);
			return;
		}

		this.render.showMessage("Когда-нибудь тут будет поиск билетов... И даже кнопки заработают... Наверное...");
		this.render.clearForm();
		this.calendar.clearCalendar();
		setTimeout(() => {
			this.render.hideMessage();
		}, 3000);

		this.render.clearForm();
		this.calendar.clearCalendar();
	}

	toClickDirectionsWhereListeners() {}

	toClickDirectionsFromWhereListeners() {}

	toClickDirectionsReverseListeners() {
		// this.render.showMessage('Куда и откуда поменялись местами');
		this.render.directionsReverse();
		// setTimeout(() => {
		// 	this.render.hideMessage()
		// }, 1000);
	}

	toClickMembersAdultListeners(event) {
		if (!event.target.classList.contains("form-options-control-active")) {
			return;
		}

		if (event.target.classList.contains("form-options-incr")) {
			this.render.incrementTicket("adult");
			return;
		}

		if (event.target.classList.contains("form-options-decr")) {
			this.render.decrementTicket("adult");
			return;
		}
	}

	toClickMembersTeenListeners(event) {
		if (!event.target.classList.contains("form-options-control-active")) {
			return;
		}

		if (event.target.classList.contains("form-options-incr")) {
			this.render.incrementTicket("teen");
			return;
		}

		if (event.target.classList.contains("form-options-decr")) {
			this.render.decrementTicket("teen");
			return;
		}
	}

	toClickMembersChildListeners(event) {
		if (!event.target.classList.contains("form-options-control-active")) {
			return;
		}

		if (event.target.classList.contains("form-options-incr")) {
			this.render.incrementTicket("child");
			return;
		}

		if (event.target.classList.contains("form-options-decr")) {
			this.render.decrementTicket("child");
			return;
		}
	}

	toClickRoundtripListeners(event) {
		if (!event.target.checked) {
			this.calendar.clearDirectionBack();

			if (this.calendar.calendar.dataset.direction === "back") {
				this.calendar.hideCalendar();
			}
		}

		this.render.toggleRoundtrip(event);
	}

	toClickDatesThereListeners(event) {
		this.calendar.showCalendar("there", event);
	}

	toClickDatesBackListeners(event) {
		if (event.target.classList.contains("form-dates-item-disable")) {
			return;
		}

		this.calendar.showCalendar("back", event);
	}

	toClickCalendarListeners(event) {
		if (event.target.classList.contains("calendar-body-date-passive")) {
			return;
		}

		if (event.target.tagName === "TD") {
			const index = event.target.dataset.id;
			const date = this.calendar.dates[index];
			const ceil = this.calendar.calendar.dataset.direction;

			this.render.showDate(date, ceil);
			this.calendar.dateSelection(event.target);
		}
	}

	toClickNavigationLeftListeners() {
		if (event.target.classList.contains("calendar-header-navigation-passive")) {
			return;
		}
		this.calendar.flipCalendar(-1);
	}

	toClickNavigationRightListeners() {
		this.calendar.flipCalendar(1);
	}
}
