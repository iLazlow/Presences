const presence = new Presence({
		clientId: "717505812964048986",
	}),
	elapsed = Math.floor(Date.now() / 1000);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface String {
	capitalize(): string;
}

String.prototype.capitalize = function (d = /[ -]/): string {
	let r = "";
	const a = this.toString().split(d);
	for (let i = 0; i < a.length; i++) {
		if (i === 0) r = a[i].charAt(0).toUpperCase() + a[i].slice(1);
		else {
			r =
				r +
				this.toString().substring(
					a.slice(0, i).join().length,
					a.slice(0, i).join().length + 1
				) +
				a[i].charAt(0).toUpperCase() +
				a[i].slice(1);
		}
	}
	return r;
};

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://cdn.rcd.gg/PreMiD/websites/N/Nookazon/assets/logo.png",
			startTimestamp: elapsed,
		},
		useChatNames = await presence.getSetting<boolean>("useChatNames");

	let department: string,
		category: string,
		tag: string,
		diy: boolean,
		filter: string;

	switch (document.location.pathname.replace("/", "").split("/")[0]) {
		case "":
			presenceData.details = "Homepage";
			break;
		case "latest":
			presenceData.details = "Latest Listings";
			break;
		case "guide":
			presenceData.details = "Getting Started Guide";
			break;
		case "faq":
			presenceData.details = "Frequently Asked Questions";
			break;
		case "trading-guide":
			presenceData.details = "Safe Trading Guide";
			break;
		case "signup":
			presenceData.details = "Signing Up";
			break;
		case "login":
			presenceData.details = "Logging In";
			break;
		case "submit-feedback":
			presenceData.details = "Feedback Submission Guide";
			break;
		case "report-users":
			presenceData.details = "User Reporting Guide";
			break;
		case "products":
			try {
				department = document.querySelector(
					".nav-bottom .selected"
				).textContent;
			} catch {
				department = "All Products";
			}
			try {
				category = document
					.querySelector(".items-category-active")
					.textContent.capitalize();
			} catch {
				category = "";
			}
			try {
				tag = new URLSearchParams(document.location.search)
					.get("tag")
					.capitalize();
			} catch {
				tag = "";
			}
			try {
				diy =
					document.querySelector<HTMLInputElement>(
						".search-diy-filter"
					).checked;
			} catch {
				diy = false;
			}
			filter = "None";
			if (category !== "") filter = category;

			if (tag !== "") {
				if (filter === "None") filter = tag;
				else filter = `${filter}, ${tag}`;
			}
			if (diy) {
				if (filter === "None") filter = "DIY";
				else filter = `${filter}, ` + "DIY";
			}
			presenceData.details = `Looking For ${department}`;
			presenceData.state = `Filters: ${filter}`;
			break;
		case "profile":
			presenceData.details = `${
				document.querySelector(".profile-name").textContent
			}'s Profile`;
			try {
				presenceData.state = `Viewing ${
					document.querySelector("a.profile-tab-active").textContent
				}`;
			} catch {
				presence.error(
					"No active profile tab - State parameter will not be reported to PreMiD."
				);
			}
			break;
		case "chat":
			presenceData.details = "Viewing Chats";
			if (document.querySelector(".chat-info")) {
				if (useChatNames) {
					presenceData.state = `Chatting With ${document
						.querySelector(".chat-info")
						.textContent.replace("Report User", "")}`;
				} else presenceData.state = "Chatting With A User";
			} else presenceData.state = "No Chats";

			break;
		case "cart":
			presenceData.details = "Viewing Cart";
			presenceData.state = `${
				document.querySelector(".profile-tab-active").textContent
			} Offers`;
			break;
		case "product":
			presenceData.details = "Viewing A Product";
			presenceData.state = document
				.querySelector(".product-name")
				.textContent.capitalize();
	}
	presence.setActivity(presenceData);
});
