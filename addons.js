const BOT_TOKEN1 = "8844146123:AAGTYKbhD488lTwiL2sq9wcxJNmkbugtu4Q"; 
const BOT_TOKEN = "8671429620:AAFhK_RxKxDFaY_aEeCu2oEnPXn0K7sccdI"; 
 
//const CHAT_ID = "-1004360786254"; // ID grup Telegram

// ============================
// MULTI BOT + MULTI GROUP
// ============================
const TELEGRAM_TARGETS = [

    // Bot 1
    {
        token: BOT_TOKEN,
        chatId: "-1004360786254"
    },

    // Bot 1 ke grup lain
    {
        token: BOT_TOKEN,
        chatId: "-1002832146816"
    }

    // Bot 2
    /* ,{
        token: BOT_TOKEN1,
        chatId: "-1009876543210"
    } */

];

function telegramText(html = "") {
    return html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<\/div>/gi, "\n")
        .replace(/<li>/gi, "• ")
        .replace(/<\/li>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function categoryToHashtag(category = "") {
    return "#" + category
        .replace(/&/g, "")          // hapus &
        .replace(/,/g, "")          // hapus koma
        .replace(/[^\w\s]/g, "")    // hapus karakter selain huruf/angka/spasi
        .replace(/\s+/g, "")        // hapus semua spasi
        .trim();
}

async function sendTelegram(data) {

    const summary = telegramText(data.content || "");
	
    const shortSummary =
        summary.length > 200
            ? summary.substring(0, summary.lastIndexOf(" ", 200)) + "..."
            : summary;

    const modded = telegramText(data.modded || "");
	const hashtag = categoryToHashtag(data.category);
	
    const caption = `
<b>${data.title}</b>

${shortSummary}

${modded}

${hashtag}

${data.url}

check to 
https://modapk.ucoz.net/
https://liteapkmod.clan.su/
https://apkgo.ucoz.org/
http://apkmod.ucoz.hu/
https://apkdnz.moy.su/
https://5play.ucoz.club/

`.trim();

    console.log("========== TELEGRAM ==========");

    const results = [];

    for (const target of TELEGRAM_TARGETS) {

        console.log("--------------------------------");
        console.log("BOT :", target.token.substring(0, 12) + "...");
        console.log("CHAT:", target.chatId);

        try {

            // ============================
            // PRIORITAS 1 : FILE
            // ============================
            if (data.imageFile) {

                const form = new FormData();

                form.append("chat_id", target.chatId);
                form.append("photo", data.imageFile);
                form.append("caption", caption);
                form.append("parse_mode", "HTML");

                const res = await fetch(
                    `https://api.telegram.org/bot${target.token}/sendPhoto`,
                    {
                        method: "POST",
                        body: form
                    }
                );

                const json = await res.json();

                console.log(json);

                if (!json.ok) {
                    throw new Error(json.description);
                }

                console.log("✅ FILE berhasil");

                results.push({
                    chatId: target.chatId,
                    success: true,
                    method: "FILE",
                    response: json
                });

                continue;
            }

            // ============================
            // PRIORITAS 2 : URL
            // ============================
            if (data.image) {

                const res = await fetch(
                    `https://api.telegram.org/bot${target.token}/sendPhoto`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            chat_id: target.chatId,
                            photo: data.image,
                            caption,
                            parse_mode: "HTML"
                        })
                    }
                );

                const json = await res.json();

                console.log(json);

                if (json.ok) {

                    console.log("✅ URL berhasil");

                    results.push({
                        chatId: target.chatId,
                        success: true,
                        method: "URL",
                        response: json
                    });

                    continue;
                }

                console.warn("URL gagal:", json.description);
            }

            // ============================
            // PRIORITAS 3 : TEXT
            // ============================
            const res = await fetch(
                `https://api.telegram.org/bot${target.token}/sendMessage`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        chat_id: target.chatId,
                        text: caption,
                        parse_mode: "HTML"
                    })
                }
            );

            const json = await res.json();

            console.log(json);

            if (!json.ok) {
                throw new Error(json.description);
            }

            console.log("✅ TEXT berhasil");

            results.push({
                chatId: target.chatId,
                success: true,
                method: "TEXT",
                response: json
            });

        } catch (err) {

            console.error(
                "❌ Gagal",
                target.chatId,
                err.message
            );

            results.push({
                chatId: target.chatId,
                success: false,
                error: err.message
            });

        }

    }

    console.log("========== HASIL ==========");
    console.table(results);

    const successCount = results.filter(r => r.success).length;

    console.log(
        `Berhasil ${successCount} dari ${TELEGRAM_TARGETS.length} tujuan`
    );

    return results;

}
 

const FACEBOOK_PAGES = [

    {
        pageId: "1197158496811176",
        accessToken: "EAAfuD4idHfUBRxdWCZC9yRYqK0uF8PQ2H81xCZAvLOiYrY4BF5MgIrsjEURpnE1VZAJ3LdQk2Q6uXdS4YlZCPHqecOjgS0k3t3QMsDRNPuMpYaWoovC5Wf6lOMjdLbbz5IN6sYSXhAvbcTCl5BNnXnvxdUZBURQQBc1rbAOFWB3RsFOzLHRBV5MQZAZCKZBenODZASyneTEZCxYw4E6AFhHfgOMjHOrZAfNf9sZAtqbEsgkZD"
    }

    // Multi Page
    /*
    ,{
        pageId: "1234567890",
        accessToken: "EAAByyyyyyyyyyyyyyyyyyyyyyyy"
    }
    */

];

function facebookText(html = "") {
    return html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<\/div>/gi, "\n")
        .replace(/<li>/gi, "• ")
        .replace(/<\/li>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

async function sendFacebook(data) {

    const summary = facebookText(data.content || "");

    const shortSummary =
        summary.length > 300
            ? summary.substring(0, summary.lastIndexOf(" ", 300)) + "..."
            : summary;

    const modded = facebookText(data.modded || "");

    const message = `
${data.title}

${shortSummary}

${modded}

#${(data.category || "").replace(/[&\s]+/g, "")}

${data.url}
`.trim();

    console.log("========== FACEBOOK ==========");

    const results = [];

    for (const page of FACEBOOK_PAGES) {

        console.log("--------------------------------");
        console.log("PAGE :", page.pageId);

        try {

            // =========================
            // PRIORITAS 1 : IMAGE
            // =========================
            if (data.image) {

                const body = new URLSearchParams();

                body.append("url", data.image);
                body.append("caption", message);
                body.append("access_token", page.accessToken);

                const res = await fetch(
                    `https://graph.facebook.com/v23.0/${page.pageId}/photos`,
                    {
                        method: "POST",
                        body
                    }
                );

                const json = await res.json();

                console.log(json);

                if (json.id || json.post_id) {

                    console.log("✅ IMAGE berhasil");

                    results.push({
                        pageId: page.pageId,
                        success: true,
                        method: "PHOTO",
                        response: json
                    });

                    continue;
                }

                console.warn("Photo gagal", json);
            }

            // =========================
            // PRIORITAS 2 : LINK POST
            // =========================
            const body = new URLSearchParams();

            body.append("message", message);
            body.append("link", data.url);
            body.append("access_token", page.accessToken);

            const res = await fetch(
                `https://graph.facebook.com/v23.0/${page.pageId}/feed`,
                {
                    method: "POST",
                    body
                }
            );

            const json = await res.json();

            console.log(json);

            if (!json.id) {
                throw new Error(json.error?.message || "Unknown error");
            }

            console.log("✅ POST berhasil");

            results.push({
                pageId: page.pageId,
                success: true,
                method: "POST",
                response: json
            });

        } catch (err) {

            console.error(
                "❌ Gagal",
                page.pageId,
                err.message
            );

            results.push({
                pageId: page.pageId,
                success: false,
                error: err.message
            });

        }

    }

    console.log("========== HASIL ==========");
    console.table(results);

    return results;
}

function showToast(message, type = "info", duration = 2500) {
	const container = document.getElementById("toast-container");

	const toast = document.createElement("div");
	toast.className = `toast ${type}`;
	toast.textContent = message;

	container.appendChild(toast);

	// trigger animasi
	setTimeout(() => {
		toast.classList.add("show");
	}, 10);

	// auto remove
	setTimeout(() => {
		toast.classList.remove("show");

		setTimeout(() => {
			toast.remove();
		}, 300);
	}, duration);
}

/* =========================
 IMAGE AUTO UPLOADER
========================= */
async function autoUploadImage(url, inputId, fileName) {

	try {

		const res = await fetch(url);

		const blob = await res.blob();

		const file = new File(
			[blob],
			fileName, {
				type: blob.type
			}
		);

		const dt = new DataTransfer();
		dt.items.add(file);

		const input =
			document.querySelector(
				"#" + inputId
			);

		if (!input)
			return false;

		input.files = dt.files;
		console.log(
			inputId,
			input.files.length
		);
		input.dispatchEvent(
			new Event("change", {
				bubbles: true
			})
		);

		return true;

	} catch (err) {

		console.log(
			"Upload error:",
			err
		);

		return false;

	}
}

async function imageToFile(imageUrl, fileName) {

	return new Promise((resolve, reject) => {

		const img =
			new Image();

		img.crossOrigin =
			"anonymous";

		img.onload = () => {

			const canvas =
				document.createElement(
					"canvas"
				);

			canvas.width =
				img.width;

			canvas.height =
				img.height;

			const ctx =
				canvas.getContext(
					"2d"
				);

			ctx.drawImage(
				img,
				0,
				0
			);

			canvas.toBlob(blob => {

				if (!blob) {
					reject();
					return;
				}

				resolve(
					new File(
						[blob],
						fileName, {
							type: "image/jpeg"
						}
					)
				);

			});

		};

		img.onerror =
			reject;

		img.src =
			imageUrl;

	});

}

function wpProxy(url) {
	return "https://i0.wp.com/" +
		url.replace(/^https?:\/\//, "");
}

/* =========================
 SCRAPER
========================= */
document.getElementById("scrapeForm").addEventListener("submit", async function(e) {
	e.preventDefault();


	const url = document.getElementById("url").value;
	const resultBox = document.querySelector("#result");

	const overlay = document.getElementById("loadingOverlay");
	const bar = document.getElementById("loadingBar");

	let loadingToast = null;

	// SHOW OVERLAY
	if (overlay) overlay.style.display = "flex";
	if (bar) bar.style.width = "10%";

	//resultBox.textContent = "Loading...";
	showToast("Loading data...", "info");
	try {
		const res = await fetch(
			"https://api.exthem.es/api/modyolo-detail?url=" + encodeURIComponent(url)
		);

		showToast("Fetching data from Modyolo...", "info");

		if (bar) bar.style.width = "50%";

		const json = await res.json();

		if (!json.success) {
			//resultBox.textContent = "Error: " + json.error;
			showToast("Error: " + json.error, "error");
			if (overlay) overlay.style.display = "none";
			return;
		}

		const d = json.data;
		const gp = json.googleplay;


		//console.log(JSON.stringify(gp, null, 2));


		if (bar) bar.style.width = "80%";

		// =========================
		// CATEGORY AUTO SELECT
		// =========================
		const parentGenre =
			String(
				gp?.parentgenre || ""
			).toUpperCase();

		const modyoloCategory =
			String(
				d?.category || ""
			).toLowerCase();

		const gameCategories = [
			"action",
			"adventure",
			"arcade",
			"board",
			"card",
			"casino",
			"casual",
			"music",
			"puzzle",
			"racing",
			"role playing",
			"simulation",
			"sports",
			"strategy",
			"trivia",
			"word"
		];

		const isGame =
			parentGenre.startsWith("GAME_") ||
			gameCategories.includes(
				modyoloCategory
			);

		const targetText =
			isGame ? "games" : "apps";

		console.log(
			"parentGenre =",
			parentGenre
		);

		console.log(
			"modyoloCategory =",
			modyoloCategory
		);

		console.log(
			"isGame =",
			isGame
		);

		console.log(
			"targetText =",
			targetText
		);

		const categorySelector =
			document.querySelector(
				"#catSelector9"
			);

		if (categorySelector) {

			// buka dropdown
			categorySelector.click();

			await new Promise(resolve =>
				setTimeout(resolve, 300)
			);

			const targetLabel = [
				...document.querySelectorAll(
					"label"
				)
			].find(label =>
				label.textContent
				.trim()
				.toLowerCase() === targetText
			);

			if (targetLabel) {

				targetLabel.click();
				showToast(`Category: ${targetText}`, "success");
				/* console.log(
				"Category selected:",
				targetText
				); */

			} else {

				showToast(`Category label not found: ${targetText}`, "error");
				/* console.log(
				"Category label not found:",
				targetText
				); */

			}

			await new Promise(resolve =>
				setTimeout(resolve, 300)
			);
		}


		const appName = d.appname || "";
		const appNameZ = d.appname || d.title || "";

		const safeName = appNameZ
			.trim()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.toLowerCase();

		const category = d.category || "";

		const $ = (sel) => document.querySelector(sel);

		const setVal = (el, val) => {
			if (!el) return;
			el.value = val || "";
			el.dispatchEvent(new Event("input", {
				bubbles: true
			}));
			el.dispatchEvent(new Event("change", {
				bubbles: true
			}));
		};

		setVal($("#puF1"), appName);
		setVal($("#input_extrafl1"), appName);
		setVal($("#input_extrafl3"), category);

		setVal($("#input_extrafl2"), d.publisher);
		setVal($("#input_extrafl5"), d.version);
		setVal($("#input_extrafl4"), d.size);
		setVal($("#input_extrafl6"), d.modInfo);
		setVal($("#input_extrafl7"), d.directApk);
		setVal($("#puF7"), d.googlePlay);

		const messageEl = $("#message");
		if (messageEl) {
			messageEl.value = d.content || "";
			messageEl.dispatchEvent(new Event("input", {
				bubbles: true
			}));
		}

		setVal($("#suggEdit"), [appName, category].filter(Boolean).join(", "));

		// IMAGE PREVIEW
		const PLACEHOLDER_ICON =
			"https://5play.ucoz.club/no-image.png";

		const PLACEHOLDER_BG =
			"https://5play.ucoz.club/minimalist.jpg";

		// IMAGE PREVIEW
		/* const img = d.image || "";
		const bg = d.background || ""; */

		/* 
		const img = d.image || PLACEHOLDER_ICON;
		const bg = d.background || PLACEHOLDER_BG;
		*/

		const img =
			d.image ?
			wpProxy(d.image) :
			"";

		const bg =
			d.background ?
			wpProxy(d.background) :
			"";

		console.log("IMAGE =", img);
		console.log("BACKGROUND =", bg);
		console.log("safeName =", bg);

		console.log(
			"IMG PROXY =",
			wpProxy(d.image)
		);

		console.log(
			"BG PROXY =",
			wpProxy(d.background)
		);

		const preview = document.querySelector("#resultPreview");

		if (preview) {
			preview.style.display = "block";

			document.querySelector("#previewBg").src = bg;
			document.querySelector("#previewImg").src = img;

			document.querySelector("#previewTitle").textContent = appName;
			document.querySelector("#previewCat").textContent = category;
		}

		// upload image utama ke fln1
		if (img) {
			let ok =
				await autoUploadImage(
					img,
					"fln1",
					`${safeName}-icon.jpg`
				);

			showToast("Icon uploaded", "success");
			console.log(
				"FLN1 FILES =",
				document.querySelector("#fln1").files
			);

			console.log(
				"FLN1 FILE =",
				document.querySelector("#fln1").files[0]
			);

			if (!ok) {

				console.log(
					"Using placeholder icon"
				);

				await autoUploadImage(
					PLACEHOLDER_ICON,
					"fln1",
					`${safeName}-icon.jpg`
				);

			}
		}

		// jika ada background, buat field kedua lalu upload ke fln2
		if (bg) {

			const addImageBtn = document.querySelector("#iplus button");

			if (addImageBtn) {
				addImageBtn.click();

				// tunggu sampai fln2 muncul
				await new Promise((resolve, reject) => {

					const start = Date.now();

					const timer = setInterval(() => {

						const fln2 = document.querySelector("#fln2");

						if (fln2) {
							clearInterval(timer);
							resolve();
							return;
						}

						// timeout 5 detik
						if (Date.now() - start > 5000) {
							clearInterval(timer);
							reject(new Error("fln2 not found"));
						}

					}, 100);

				});

				let okBg =
					await autoUploadImage(
						bg,
						"fln2",
						`${safeName}-background.jpg`
					);
				showToast("Background uploaded", "success");
				console.log(
					"FLN2 FILES =",
					document.querySelector("#fln2").files
				);

				console.log(
					"FLN2 FILE =",
					document.querySelector("#fln2").files[0]
				);

				if (!okBg) {

					console.log(
						"Using placeholder background"
					);

					await autoUploadImage(
						PLACEHOLDER_BG,
						"fln2",
						`${safeName}-background.jpg`
					);

				}
			}
		}

		if (bar) bar.style.width = "100%";

		// HIDE OVERLAY
		setTimeout(() => {
			if (overlay) overlay.style.display = "none";
			if (bar) bar.style.width = "0%";
		}, 400);

		const visualRadio = document.querySelector('input[name="message_editor_type"][value="message_1"]');

		if (visualRadio) {
			// set checked
			visualRadio.checked = true;

			// trigger change event (WAJIB untuk uCoz)
			visualRadio.dispatchEvent(new Event("change", {
				bubbles: true
			}));

			// juga klik label biar UI ikut berubah
			const label = visualRadio.closest("label");
			if (label) label.click();
		}

		// SCROLL + AUTO SUBMIT
		function submitPost() {

			var addBtn = document.getElementById("puF9");

			if (!addBtn) return;

			//console.log("Submitting post..."); 
			showToast("Submitting post....", "info");

			addBtn.click();

			var elapsed = 0;

			//var timer = setInterval(function () {
			var timer = setInterval(async function() {
				// sukses
				var success = document.querySelector(
					".myWinSuccess"
				);

				if (
					success &&
					/Entry successfully added/i.test(
						success.textContent
					)
				) {

					clearInterval(timer);

					//console.log("Success!");

					showToast("Success", "success");

					const waitLink = setInterval(async () => {

						const entryLink = document.querySelector(".myWinSuccess + span a");
						
						if (!entryLink) return;

						clearInterval(waitLink);

						try {

							const imageFile =
								document.querySelector("#fln2")?.files?.[0] ||
								document.querySelector("#fln1")?.files?.[0] ||
								null; 

							/* await sendTelegram({
								title: d.title,
								content: d.content,
								modded: d.mod_full || d.modInfo || "",
								category,
								imageFile, 
								image: d.background || d.image || "",
								url: entryLink.href
							}); */
							
							await Promise.all([
								sendTelegram({
									title: d.title,
									content: d.content,
									modded: d.mod_full || d.modInfo || "",
									category,
									imageFile,
									image: d.background || d.image || "",
									url: entryLink.href
								}),
								sendFacebook({
									title: d.title,
									content: d.content,
									modded: d.mod_full || d.modInfo || "",
									category,
									image: d.background || d.image || "",
									url: entryLink.href
								})
							]);

							showToast("Telegram berhasil dikirim", "success");

							setTimeout(() => {
								location.reload();
							}, 1500);

						} catch (err) {

							console.error(err);
							showToast("Telegram gagal", "error");

						}

					}, 300);

					return;

				}

				elapsed += 1000;

				// timeout 15 detik
				/* 
				if (elapsed >= 15000) {

				clearInterval(timer);
				
				showToast("Submit timeout, retry...", "error");

				// tutup popup jika ada
				var closeBtn = document.querySelector(
				".xt.xt-close.xt-close2"
				);

				if (closeBtn) {
				closeBtn.click();
				}

				// submit ulang
				setTimeout(function () {
				submitPost();
				}, 1000);

				} 
				*/

				// timeout 15 detik
				if (elapsed >= 15000) {

					clearInterval(timer);

					showToast("Submit timeout", "error");

				}

			}, 1000);

		}


		// ====================
		// SCROLL KE ADD BUTTON
		// ====================
		setTimeout(function() {

			var addBtn =
				document.getElementById("puF9");

			if (!addBtn) return;

			var y = 0;
			var el = addBtn;

			while (el) {
				y += el.offsetTop;
				el = el.offsetParent;
			}

			window.scrollTo(0, y - 150);

			setTimeout(function() {

				submitPost();

			}, 1000);

		}, 1000);

	} catch (err) {
		if (overlay) overlay.style.display = "none";
		//resultBox.textContent = "Request failed: " + err.message;
		showToast("Request failed: " + err.message, "error");
	}
});