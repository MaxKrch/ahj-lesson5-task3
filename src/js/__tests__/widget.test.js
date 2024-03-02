import TicketWidget from "../Widget";
import moment from "moment";

describe("create, filling and submit form", () => {
	document.body.innerHTML = `
		<div class="widget" id="widget">
		</div>
	`;

	const widget = new TicketWidget("#widget");
	const adult = widget.render.members.adult;
	const count = adult.querySelector(".form-options-count");
	const inc = adult.querySelector(".form-options-incr");
	const decr = adult.querySelector(".form-options-decr");

	const where = widget.render.directions.where;
	const fromwhere = widget.render.directions.fromwhere;
	const reverse = widget.render.directions.reverse;

	test("empty error", () => {
		expect(widget.render.error.classList.contains("invalid")).not.toBeTruthy();
	});

	test("render correct ticket", () => {
		expect(count.textContent.trim()).toBe("1");
	});

	test("inc ticket", () => {
		inc.click();

		expect(count.textContent.trim()).toBe("2");
	});

	test("decr ticket", () => {
		decr.click();

		expect(count.textContent.trim()).toBe("1");
	});

	test("disable switcher roundtrip", () => {
		expect(widget.render.roundtrip.checked).not.toBeTruthy();
	});

	test("switch roundtrip", () => {
		widget.render.roundtrip.click();

		expect(widget.render.roundtrip.checked).toBeTruthy();
	});

	test("switch direction", () => {
		where.value = "";
		fromwhere.value = "Paris";
		reverse.click();

		expect(where.value).toBe("Paris");
	});

	test("empty date", () => {
		widget.render.error.classList.remove("invalid");

		where.value = "Moscow";
		fromwhere.value = "Paris";
		widget.render.form.submit();

		expect(widget.render.error.classList.contains("invalid")).toBeTruthy();
	});

	test("empty back date", () => {
		widget.render.error.classList.remove("invalid");

		where.value = "Moscow";
		fromwhere.value = "Paris";
		widget.render.roundtrip.click();
		widget.render.dates.there.click();

		widget.render.form.submit();

		expect(widget.render.error.classList.contains("invalid")).toBeTruthy();
	});

	test("success submit", () => {
		widget.render.error.classList.remove("invalid");

		where.value = "Moscow";
		fromwhere.value = "Paris";
		widget.render.dates.there.click();

		const dates = Array.from(widget.calendar.calendar.querySelectorAll(".calendar-body-date"));

		dates[25].click();
		widget.render.form.submit();

		expect(widget.render.error.classList.contains("invalid")).not.toBeTruthy();
	});

	test("activated date", () => {
		widget.render.dates.there.click();

		const dates = Array.from(widget.calendar.calendar.querySelectorAll(".calendar-body-date"));

		dates[35].classList.remove("calendar-body-date-selected");
		dates[35].click();

		expect(dates[35].classList.contains("calendar-body-date-selected")).toBeTruthy();
	});

	test("selected uncorrect date", () => {
		widget.render.dates.there.click();

		const dates = Array.from(widget.calendar.calendar.querySelectorAll(".calendar-body-date"));

		dates[35].classList.remove("calendar-body-date-selected");
		dates[35].click();

		widget.render.roundtrip.click();

		widget.render.dates.back.click();

		const datesTwo = Array.from(widget.calendar.calendar.querySelectorAll(".calendar-body-date"));

		datesTwo[25].classList.remove("calendar-body-date-selected");
		datesTwo[25].click();

		expect(datesTwo[25].classList.contains("calendar-body-date-selected")).not.toBeTruthy();
	});

	test("right flip calendar", () => {
		const monthNow = widget.calendar.month.textContent;
		const monthNext = moment(monthNow, "MMM YYYY", "ru").add(1, "months");

		widget.calendar.navigation.right.click();

		expect(moment(widget.calendar.month.textContent, "MMM YYYY", "ru").isSame(monthNext, "months")).toBeTruthy();
	});

	test("left flip calendar", () => {
		const month = widget.calendar.month.textContent;
		const monthNow = moment(month, "MMM YYYY", "ru");

		widget.calendar.navigation.right.click();
		widget.calendar.navigation.left.click();

		expect(moment(widget.calendar.month.textContent, "MMM YYYY", "ru").isSame(monthNow, "months")).toBeTruthy();
	});
});
