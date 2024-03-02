import moment from "moment";

export default class RenderWidget {
	constructor(widget) {
		this.widget = widget;
		this.form;
		this.directions = {};
		this.members = {};
		this.roundtrip;
		this.dates = {};
		this.modal = {};
		this.error;

		this.submitFormListeners = [];

		this.clickDirectionsWhereListeners = [];
		this.clickDirectionsFromWhereListeners = [];
		this.clickDirectionsReverseListeners = [];

		this.clickMembersAdultListeners = [];
		this.clickMembersTeenListeners = [];
		this.clickMembersChildListeners = [];

		this.clickRoundtripListeners = [];
		this.clickDatesThereListeners = [];
		this.clickDatesBackListeners = [];

		this.init();
	}

	init() {
		this.renderPage();
		this.registerEventListeners();
	}

	registerEventListeners() {
		this.form.addEventListener("submit", () => {
			event.preventDefault();
			this.submitFormListeners.forEach((item) => item());
		});

		this.directions.fromwhere.addEventListener("click", (event) => {
			this.clickDirectionsWhereListeners.forEach((item) => item(event));
		});
		this.directions.where.addEventListener("click", (event) => {
			this.clickDirectionsFromWhereListeners.forEach((item) => item(event));
		});
		this.directions.reverse.addEventListener("click", (event) => {
			this.clickDirectionsReverseListeners.forEach((item) => item(event));
		});

		this.members.adult.addEventListener("click", (event) => {
			this.clickMembersAdultListeners.forEach((item) => item(event));
		});
		this.members.teen.addEventListener("click", (event) => {
			this.clickMembersTeenListeners.forEach((item) => item(event));
		});
		this.members.child.addEventListener("click", (event) => {
			this.clickMembersChildListeners.forEach((item) => item(event));
		});

		this.roundtrip.addEventListener("click", (event) => {
			this.clickRoundtripListeners.forEach((item) => item(event));
		});
		this.dates.there.addEventListener("click", (event) => {
			this.clickDatesThereListeners.forEach((item) => item(event));
		});
		this.dates.back.addEventListener("click", (event) => {
			this.clickDatesBackListeners.forEach((item) => item(event));
		});
	}

	renderPage() {
		const formContainer = document.createElement("div");
		formContainer.classList.add("form-container");

		const form = this.renderForm();
		formContainer.append(form);
		this.widget.append(formContainer);

		const modal = this.renderModal();
		this.widget.append(modal);
	}

	renderForm() {
		const form = document.createElement("form");
		form.setAttribute("action", "#");
		form.setAttribute("method", "GET");
		form.classList.add("main-form");

		form.innerHTML = `
			<h2 class="form-title">
				Поиск билетов
			</h2>
		
			<div class="form-directions">

				<label for="form-direction-fromwhere" class="form-label form-directions-label">
					<p class="form-options-description form-directions-description">
						Откуда:
					</p>
					<input type="text" class="form-options-input form-input-text form-directions-input" id="form-direction-fromwhere" placeholder="Откуда">
				</label>
				 
				<label for="form-direction-where" class="form-label form-directions-label">
					<p class="form-options-description form-directions-description">
						Куда:
					</p>
					<input type="text" class="form-options-input form-input-text form-directions-input" id="form-direction-where" placeholder="Куда">
				</label>

				<div class="form-directions-reverse">
				</div>
				
			</div>
						
			<div class="form-options">

				<div class="form-options-adults form-options-block">
					<p class="form-options-adults-description form-options-description">
						Взрослые:
					</p>
				
					<div class="form-options-adults-digitals form-options-digitals">
			
						<input type="number" class="hidden-item form-options-input form-options-adults-input">
			
						<div class="form-options-adults form-options-control form-options-control-active form-options-decr">
							&laquo;
						</div>
							
						<div class="form-options-adults form-options-count">
							1
						</div>
							
						<div class="form-options-adults form-options-control form-options-control-active form-options-incr">
							&raquo;
						</div>
					</div>
				</div>

				<div class="form-options-teen form-options-block">
					<p class="form-options-teen-description form-options-description">
						Дети до 10 лет:
					</p>
						
					<div class="form-options-teen-digitals form-options-digitals">
						<input type="number" class="hidden-item form-options-input form-options-teen-input">
						<div class="form-options-teen form-options-control form-options-decr form-options-control-passive">
							&laquo;
						</div>
							
						<div class="form-options-teen form-options-count">
							0
						</div>
							
						<div class="form-options-teen form-options-control form-options-incr form-options-control-active">
							&raquo;
						</div>
					</div>
				</div>

				<div class="form-options-child form-options-block">
					<p class="form-options-child-description form-options-description">
						Дети до 5 лет:
					</p>
						
					<div class="form-options-child-digitals form-options-digitals">
						<input type="number" class="hidden-item form-options-input form-options-child-input">
						<div class="form-options-child form-options-control form-options-decr form-options-control-passive">
							&laquo;
						</div>
							
						<div class="form-options-child form-options-count">
							0
						</div>
							
						<div class="form-options-child form-options-control form-options-incr form-options-control-active">
							&raquo;
						</div>
					</div>
				</div>
			
				<label for="roundtrip" class="form-options-block form-label form-options-roundtrip">
					<p class="form-options-roundtrip-description form-options-description">
						Туда и обратно:
					</p>
					<div class="form-options-switch form-options-roundtrip-switch">
						<input id="roundtrip" type="checkbox" class="hidden-item form-options-input form-options-roundtrip-input">
						<div class="form-options-switch-arrow form-options-roundtrip-switch-arrow">
							&laquo;-&raquo;
						</div>
					</div>
				</label>
			</div>
							
			<div class="form-dates">
				<p class="form-options-description form-dates-description">
					Даты: 
				</p>

				<div class="form-dates-block">	
					<p class="form-dates-item form-dates-there form-dates-item-active" data-id='null'>
						Туда	
					</p>
					
					<p class="form-dates-item form-dates-back form-dates-item-disable" data-id='null'>
						
					</p>
				</div>
			</div>
						
			<button class="form-submit button">
				Найти билеты
			</button>
	
			<div class='error-wrap'>
				<span class='form-error hidden-item'>
					Текст ошибки
				</span>
				<span>
					&nbsp;
				</span>					
			</div>
		`;

		this.saveElementsForm(form);

		return form;
	}

	saveElementsForm(form) {
		this.form = form;

		this.directions.fromwhere = form.querySelector("#form-direction-fromwhere");
		this.directions.where = form.querySelector("#form-direction-where");
		this.directions.reverse = form.querySelector(".form-directions-reverse");

		this.members.adult = form.querySelector(".form-options-adults-digitals");
		this.members.teen = form.querySelector(".form-options-teen-digitals");
		this.members.child = form.querySelector(".form-options-child-digitals");

		this.roundtrip = form.querySelector("#roundtrip");

		this.dates.there = form.querySelector(".form-dates-there");
		this.dates.back = form.querySelector(".form-dates-back");

		this.error = form.querySelector(".form-error");
	}

	renderModal() {
		const modal = document.createElement("div");
		modal.classList.add("modal", "hidden-item");
		modal.innerHTML = `
			<div class="message-block">
				<div class="message-text">
					Когда-нибудь тут может быть поиск билетов
				</div>

				<div class="message-buttons">
					<button class="message-button message-confirm">
						Ok
					</button>
					<button class="message-button message-cancel">
						Cancel
					</button>
				</div>
			</div>
		`;

		this.saveElementsModal(modal);

		return modal;
	}

	saveElementsModal(modal) {
		this.modal.container = modal;
		this.modal.text = modal.querySelector(".message-text");
		this.modal.confirm = modal.querySelector(".message-confirm");
		this.modal.cancel = modal.querySelector(".message-cancel");
	}

	addSubmitFormListeners(callback) {
		this.submitFormListeners.push(callback);
	}
	addClickDirectionsWhereListeners(callback) {
		this.clickDirectionsWhereListeners.push(callback);
	}
	addClickDirectionsFromWhereListeners(callback) {
		this.clickDirectionsFromWhereListeners.push(callback);
	}
	addClickDirectionsReverseListeners(callback) {
		this.clickDirectionsReverseListeners.push(callback);
	}
	addClickMembersAdultListeners(callback) {
		this.clickMembersAdultListeners.push(callback);
	}
	addClickMembersTeenListeners(callback) {
		this.clickMembersTeenListeners.push(callback);
	}
	addClickMembersChildListeners(callback) {
		this.clickMembersChildListeners.push(callback);
	}
	addClickRoundtripListeners(callback) {
		this.clickRoundtripListeners.push(callback);
	}
	addClickDatesThereListeners(callback) {
		this.clickDatesThereListeners.push(callback);
	}
	addClickDatesBackListeners(callback) {
		this.clickDatesBackListeners.push(callback);
	}

	showMessage(message) {
		this.modal.text.textContent = message;
		this.modal.container.classList.remove("hidden-item");
	}

	clearForm() {
		this.directions.where.value = "";
		this.directions.fromwhere.value = "";

		this.dates.there.textContent = "Туда";
		this.dates.back.textContent = "";
		this.roundtrip.checked = false;
		this.dates.back.classList.remove("form-dates-item-active");
		this.dates.back.classList.add("form-dates-item-disable");

		this.members.adult.querySelector(".form-options-count").textContent = 1;
		this.members.teen.querySelector(".form-options-count").textContent = 0;
		this.members.child.querySelector(".form-options-count").textContent = 0;

		const descTeen = this.members.teen.querySelector(".form-options-decr");
		descTeen.classList.remove("form-options-control-active");
		descTeen.classList.add("form-options-control-passive");

		const descChild = this.members.child.querySelector(".form-options-decr");
		descChild.classList.remove("form-options-control-active");
		descChild.classList.add("form-options-control-passive");
	}

	hideMessage() {
		this.modal.text.textContent = "";
		this.modal.container.classList.add("hidden-item");
	}

	showError(error) {
		this.error.textContent = error;
		this.error.classList.remove("hidden-item");
		this.error.classList.add("invalid");
	}

	hideError() {
		this.error.textContent = "";
		this.error.classList.add("hidden-item");
		this.error.classList.remove("invalid");
	}

	directionsReverse() {
		const oldWhere = this.directions.where.value;
		const oldFromWhere = this.directions.fromwhere.value;

		this.directions.where.value = oldFromWhere;
		this.directions.fromwhere.value = oldWhere;
	}

	incrementTicket(ticket) {
		const ceilMembers = this.members[ticket];
		const stringCountTicket = ceilMembers.querySelector(".form-options-count");
		const oldCountTicket = Number(stringCountTicket.textContent.trim());
		const newCountTicket = oldCountTicket + 1;
		stringCountTicket.textContent = newCountTicket;

		const incr = ceilMembers.querySelector(".form-options-decr");
		incr.classList.add("form-options-control-active");
		incr.classList.remove("form-options-control-passive");
	}

	decrementTicket(ticket) {
		const ceilMembers = this.members[ticket];
		const stringCountTicket = ceilMembers.querySelector(".form-options-count");
		const oldCountTicket = Number(stringCountTicket.textContent.trim());
		const newCountTicket = oldCountTicket - 1;
		stringCountTicket.textContent = newCountTicket;

		if (newCountTicket === 0) {
			const desc = ceilMembers.querySelector(".form-options-decr");
			desc.classList.remove("form-options-control-active");
			desc.classList.add("form-options-control-passive");
		}
	}

	toggleRoundtrip(event) {
		this.dates.back.classList.toggle("form-dates-item-active");
		this.dates.back.classList.toggle("form-dates-item-disable");

		if (event.target.checked) {
			this.dates.back.textContent = "Обратно";
		} else {
			this.dates.back.textContent = "";
		}
	}

	showDate(date, ceil) {
		const ceilDiv = this.dates[ceil];
		ceilDiv.textContent = moment(date).locale("ru").format("DD MMMM YYYY");
		if (ceil === "there") {
			const there = moment(this.dates.there.textContent, "DD MMMM YYYY", "ru");
			const back = moment(this.dates.back.textContent, "DD MMMM YYYY", "ru");

			if (there.isAfter(back)) {
				this.dates.back.textContent = "Обратно";
			}
		}
	}
}
