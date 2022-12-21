const ICONS = {
	copy: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none"><path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 18v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`,

	share: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path d="M503.691 189.836L327.687 37.851C312.281 24.546 288 35.347 288 56.015v80.053C127.371 137.907 0 170.1 0 322.326c0 61.441 39.581 122.309 83.333 154.132c13.653 9.931 33.111-2.533 28.077-18.631C66.066 312.814 132.917 274.316 288 272.085V360c0 20.7 24.3 31.453 39.687 18.164l176.004-152c11.071-9.562 11.086-26.753 0-36.328z" fill="currentColor"/></svg>`,
	computer: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M3 18h18V5h0a1 1 0 0 0-1-1H4h0a1 1 0 0 0-1 1v13zm-1 2h20c1 0 1-1 1-1H1s0 1 1 1z"/></svg>`,
	audio: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024"><path d="M512 624c93.9 0 170-75.2 170-168V232c0-92.8-76.1-168-170-168s-170 75.2-170 168v224c0 92.8 76.1 168 170 168zm330-170c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8c0 140.3-113.7 254-254 254S258 594.3 258 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8c0 168.7 126.6 307.9 290 327.6V884H326.7c-13.7 0-24.7 14.3-24.7 32v36c0 4.4 2.8 8 6.2 8h407.6c3.4 0 6.2-3.6 6.2-8v-36c0-17.7-11-32-24.7-32H548V782.1c165.3-18 294-158 294-328.1z" fill="currentColor"/></svg>`,
	video: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20"><g fill="none"><path d="M13 6.5A2.5 2.5 0 0 0 10.5 4h-6A2.5 2.5 0 0 0 2 6.5v7A2.5 2.5 0 0 0 4.5 16h6a2.5 2.5 0 0 0 2.5-2.5v-7z" fill="currentColor"/><path d="M14 7.93v4.152l2.764 2.35A.75.75 0 0 0 18 13.86V6.193a.75.75 0 0 0-1.23-.575L14 7.93z" fill="currentColor"/></g></svg>`,
}
const Toast = swal.mixin({
	toast: true,
	position: "top-right",
	iconColor: "white",
	customClass: {
		popup: "colored-toast"
	},
	showConfirmButton: false,
	timer: 1500,
	timerProgressBar: true
});

let peer = new Peer({
	config: {
		iceServers: [
			{ url: "stun:stun.l.google.com:19302" },
			{ url: "stun:stun1.l.google.com:19302" },
			{ url: "stun:stun2.l.google.com:19302" },
			{ url: "stun:stun3.l.google.com:19302" }
		]
	} /* Sample servers, please use appropriate ones */
});
peer.on("close", () => {
	document.querySelector(".buttons").classList.add("hide");
	document.querySelector("video")?.remove();
	swal.fire({
		title: "Демонстрация Экрана Отключен",
		icon: "info",
		text: "Совместное использование экрана закончилось, это может произойти из-за плохого соединения, но в большинстве случаев из-за того, что пользователь перестал делиться своим экраном.",
		confirmButtonText: "Хорошо.Это было весело",
		reverseButtons: true,
		allowEscapeKey: false,
		allowOutsideClick: false,
		backdrop: false,
		customClass: {
			popup: "fullscreen"
		}
	}).then(() => {
		location.reload();
	})
})
const peerInitiated = new Promise((res) => peer.on("open", res));
const params = Object.fromEntries(
	new URLSearchParams(location.search).entries()
);
if (params.id) {
	join(params.id);
} else {
	swal
		.fire({
			title: "Привет!",
			text:
				"Хотите поделиться своим экраном или просмотреть чужой экран?",
			confirmButtonText: `${ICONS.share} Поделиться Экраном`,
			denyButtonText: `${ICONS.computer} Присоединиться к Экрану`,
			showDenyButton: true,
			denyButtonColor: "#0006",
			reverseButtons: true,
			allowEscapeKey: false,
			allowOutsideClick: false,
			backdrop: false,
			customClass: {
				popup: "fullscreen"
			}
		})
		.then(({ value }) => {
			if (value === true /* Share screen */) {
				init({ action: "share", peer });
			} else {
				new swal({
					title: "Вставь ID Экрана Сюда",
					input: "text",
					inputLabel: "Это должен быть идентификатор встречи, который вы скопировали.",
					inputAttributes: {
						autofocus: true
					},
					customClass: {
						popup: "fullscreen"
					},
					backdrop: false,
					inputPlaceholder: "ID Экрана Сдесь",
					showCancelButton: false,
					confirmButtonText: `Присоединиться`,
					showCloseButton: false,
					focusConfirm: true,
					allowEscapeKey: false,
					allowOutsideClick: false
				}).then(({ value }) => {
					Toast.fire({
						icon: "info",
						title: "Присоединение...",
						timer: 5000,
					});
					init({ action: "join", id: value, peer });
				});
			}
		});
}
function join(id) {
	Toast.fire({
		icon: "info",
		title: "Joining...",
		timer: 5000,
	});
	swal
		.fire({
			title: "View screen",
			text: "Press 'Join now' to view the screen being shared",
			confirmButtonText: "Join now",
			reverseButtons: true,
			allowEscapeKey: false,
			allowOutsideClick: false,
			backdrop: false,
			customClass: {
				popup: "fullscreen"
			}
		})
		.then(() => {
			init({ action: "join", id, peer });
		});
}
async function init({ action, id, peer }) {
	if (action === "join") {
		const h = id;
		console.log("Waiting for id");
		await peerInitiated;
		let conn = peer.connect(h);
		let errorTimeout = setTimeout(() => {
			new swal({
				title: "Не удалось присоединиться к встрече",
				icon: "error",
				text:
					"Это может быть связано с рядом причин, возможно, вы находитесь за брандмауэром, возможно, тот, кто делится, остановился, или, возможно, идентификатор встречи недействителен. Сожалею!",
				customClass: {
					popup: "fullscreen"
				},
				backdrop: false,
				showCloseButton: false,
				showConfirmButton: false,
				allowEscapeKey: false,
				allowOutsideClick: false
			});
		}, 4000);
		console.log("Connecting to %o", h);
		conn.on("open", function () {
			console.log("Sending open message");
			conn.send({ type: "share", id: peer.id });
			conn.send({ type: "joined", id: peer.id });
			window.onbeforeunload = () => conn.send({ type: "left", id: peer.id });
			conn.on("data", (data) => {
				console.log("Got data", data)
				if (data.action === "ended"){
					conn.send({type: "destroy"})
					setTimeout(() => peer.destroy());
				}
				if (data.action === "paused"){
					document.querySelector("video").classList.add("hide")
					swal.fire({
						title: "Демонстрация экрана приостановлена",
						icon: "info",
						text: "Человек, который поделился своим экраном, приостановил демонстрацию, когда он возобновит, это исчезнет.",
						showConfirmButton: false,
						reverseButtons: true,
						allowEscapeKey: false,
						allowOutsideClick: false,
						backdrop: false,
						customClass: {
							popup: "fullscreen"
						}
					})
				}
				if (data.action === "resumed"){
					swal.close();
					document.querySelector("video").classList.remove("hide")
					Toast.fire({
						icon: "info",
						title: "Трансляция возобновлена",
					});
				}
			})
		});
		peer.on("call", (call) => {
			clearTimeout(errorTimeout);
			swal.close();
			console.log("Got response call");
			call.answer();
			call.on("stream", function (stream) {
				console.log("Got stream!!!", stream);
				addStream(stream);
			});
		});
	} else if (action === "share") {
		await peerInitiated;
		const mediaStream = await getMedia();
		// If the user denies
		if (!mediaStream) return location.reload();
		const url = `${peer.id}`;
		new swal({
			title: "Скопируй Этот ID Для кого то!",
			input: "text",
			inputValue: url,
			inputAttributes: { readonly: true },
			inputPlaceholder: "There should be a meeting ID here =/",
			cancelButtonText: "No thanks",
			showCancelButton: false,
			confirmButtonText: `${ICONS.copy} Скопировать Его`,
			showCloseButton: true,
			focusConfirm: true
		}).then(async ({value}) => {
			console.assert(!!value);
			navigator.clipboard.writeText(peer.id);
			await Toast.fire({
				icon: "success",
				title: "Скопировано"
			});
		});
		addStream(mediaStream, true);
		console.log("Got media stream");

		let connections = [];
		document.querySelector(".buttons").classList.remove("hide");
		mediaStream.getVideoTracks()[0].onended = function () {
			stop(mediaStream);
			connections.forEach(i => {
				i.send({action: "ended"});
			})
			Toast.fire({
				icon: "info",
				title: "Демонстрация Окончена",
				timer: 5000,
			});
			setTimeout(() => peer.destroy(), 100);
		};
		document.querySelector("#stop").onclick = ({currentTarget: el}) => {
			Toast.fire({
				icon: "info",
				title: "Stream stopped",
				timer: 5000,
			});
			stop(mediaStream);
			connections.forEach(i => {
				i.send({action: "ended"});
			})
			setTimeout(() => peer.destroy(), 100);
		}
		document.querySelector("#copy_link").onclick = () => {
			navigator.clipboard.writeText(`${location /*location already has '/' */}?id=${peer.id}`);
			Toast.fire({
					icon: "success",
					title: "ID Демонстрации Скопирован в Буфер Обмена!",
				});
		}
		document.querySelector("#pause").onclick = ({currentTarget: el}) => {
			if (el.getAttribute("data-paused") == "false"){
				Toast.fire({
					icon: "success",
					title: "Пауза!",
					timer: 5000,
				});
				enable(mediaStream, false)
				document.querySelector("video").classList.add("hide");
				el.querySelector('.svg').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none"><path d="M6 4v16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 12L6 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 12L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
				el.setAttribute("data-paused", "true")
				connections.forEach(i => {
					console.log(i.send)
					i.send({action: "paused"});
				})
			} else {
				// This is gonna cause glitches when it hides for a different reason
				document.querySelector("video").classList.remove("hide");
				enable(mediaStream, true)
				Toast.fire({
					icon: "success",
					title: "Resumed!",
					timer: 5000,
				});
				el.querySelector(".svg").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h4v16H6z"/><path d="M14 4h4v16h-4z"/></g></svg>`;
				el.setAttribute("data-paused", "false")
				connections.forEach(i => {
					console.log(i.send)
					i.send({action: "resumed"});
				})
			}
		}
		peer.on("connection", (connection) => {
			console.log("Someone requested a connection");
			connection.on("data", function (data) {
				connection.send({action: 'test'})
				connections.push(connection);
				if (data.type == "share") {
					console.log("Sharing media stream with", data.id);
					peer.call(data.id, mediaStream);
				}
				if (data.type === "joined"){
					Toast.fire({
						icon: "info",
						title: "Someone joined",
					});
				}
				if (data.type === "destroy"){
					peer.destroy();
				}
				if (data.type === "left"){
					Toast.fire({
						icon: "info",
						title: "Someone left",
					});
				}
				console.log("Received", data);
			});
		});
	}
	function addStream(stream, local) {
		let v;
		if (!document.querySelector("video")){
			v = document.createElement("video");
			v.setAttribute("autoplay", true);
			if (local){
				v.classList.add("local");
			}
			document.body.appendChild(v);
		} else {
			v = document.querySelector("video");
		}
		if (local){
			v.setAttribute("muted", true)
		}
		v.srcObject = stream;
	}
}
function stop(stream){
	stream.getTracks().forEach(i => i.stop());
}
function enable(stream, enabled){
	stream.getTracks().forEach(i => i.enabled = enabled);
}
async function getMedia(){
	let mediaStream;
	try {
		let {value: options} = await swal.fire({
				title: "Выберите свои источники",
				confirmButtonText: "Поделиться",
				html: `
						<label class='sourceSelect_label'><div>${ICONS.audio} Аудио Источник:</div>
						<select id="audio_select" class='select'>
								<option value='display'>Звук С Твоего Компьютера</option>
								<option value='system'>Звук С Твоего Микрофона</option>
								<option value='both'>Звук С Микрофона и Компьютера Сразу</option>
								<option value='none' selected>Без Звука</option>
						</select>
						</label>
						<label class='sourceSelect_label'><div>${ICONS.video} Видео Источник:</div> 
						<select id="video_select" class='select'>
								<option value='display'>Экран</option>
								<option value='system'>Твоя Камера</option>
						</select>
						</label>
				`,
				allowEscapeKey: false,
				allowOutsideClick: false,
				backdrop: false,
				customClass: {
						popup: "fullscreen",
						confirmButton: "confirmy"
				},
				preConfirm: ()=>{
						return {
								audio: document.querySelector("#audio_select").value,
								video: document.querySelector("#video_select").value
						};
				}
				,
		});

		mediaStream = await getStream(options);
		} catch(e) { 
			let {value} = await swal.fire({
				title: "Error",
				icon: "error",
				text:
					e.message,
				confirmButtonText: "Try again",
				denyButtonText: "No thanks",
				showDenyButton: true,
				reverseButtons: true,
				allowEscapeKey: false,
				allowOutsideClick: false,
				backdrop: false,
				customClass: {
					popup: "fullscreen"
				}
			})
			try {
				mediaStream.getTracks().forEach(i => i.stop())
			}catch(e){}
			if (value === true){
					mediaStream = "retry";
			} else {
				mediaStream = false;
			}
		}
		if (mediaStream === "retry"){
			mediaStream = await getMedia();
		}
		return mediaStream;
}
async function getStream({audio, video}) {
    let permissions = {
        both: {},
        system: {},
        display: {},
				none: {},
    };
    let streams = {};
    if (video) {
        //If video === 'system' then add {system: {video: true}}
        permissions[video].video = true;
    }
    if (audio) {
        permissions[audio].audio = true;
    }
    if (permissions.both.audio) {
        permissions.system.audio = true;
        permissions.display.audio = true;
    }
    console.log(permissions);
    try {
        if (Object.keys(permissions.system).length) {
            streams.system = await navigator.mediaDevices.getUserMedia(permissions.system);
        }
        if (Object.keys(permissions.display).length) {
            //getDisplayMedia requires video.
            streams.display = await navigator.mediaDevices.getDisplayMedia({video: true, ...permissions.display});
        }
    } catch(e){
        let _streams = Object.values(streams).map(i => i.getTracks()).flat();
        //Stop all running streams
        _streams.forEach(i => i.stop())
        console.error(e);
        throw new Error(`Permission denied.`)
        return;
    }
    let audioStream, videoStream;
    videoStream = get("video", streams.system) || get("video", streams.display);
    audioStream = get("audio", streams.system) || get("audio", streams.display);
    if (!audioStream && !permissions.none.audio) {
        if (permissions.both.audio){
            throw new Error(`You selected to mix audio from your microphone and the system audio, but no audio was given.`)
            return;
        }
        throw new Error(`You selected ${audio === 'system' ? 'microphone' : 'system'} audio as the source but it was not provided.`);
        return;
    }
    if (!videoStream) {
        throw new Error(`You selected ${video === 'system' ? 'webcam' : 'display'} video as the source but it was not provided.`);
        return;
    }
    if (permissions.both.audio) {
				const audioStreams = [get("audio", streams.system), get("audio", streams.display)];
				console.log(audioStreams, mixAudio(...audioStreams));
        audioStream = mixAudio(...audioStreams)
        if (!audioStream) {
            throw new Error(`You selected to mix microphone audio and system audio but your ${get("audio", streams.system) ? "system" : "microphone"} audio was not given.`);
            return;
        }
				return createStream(videoStream, ...audioStream)
    }
    return createStream(videoStream, audioStream);
}
function get(type, stream) {
    if (type === "audio") {
        return stream?.getAudioTracks()?.[0];
    }
    if (type === "video") {
        return stream?.getVideoTracks()?.[0];
    }
}
function mixAudio(desktopStream, voiceStream) {
    // Return undefined if both are not avalible.
    if (!(desktopStream && voiceStream))
        return undefined;
		console.log({desktopStream, voiceStream})
		// desktopStream and voiceStream are tracks not streams here
		desktopStream = createStream(desktopStream);
		voiceStream = createStream(voiceStream);
    const context = new AudioContext();
    const source1 = context.createMediaStreamSource(desktopStream);
    const source2 = context.createMediaStreamSource(voiceStream);
    const destination = context.createMediaStreamDestination();

    const desktopGain = context.createGain();
    const voiceGain = context.createGain();

    desktopGain.gain.value = 0.7;
    voiceGain.gain.value = 0.7;

    source1.connect(desktopGain).connect(destination);
    source2.connect(voiceGain).connect(destination);
		// Important to return tracks
    return destination.stream.getAudioTracks();
}

function createStream(...tracks) {
    if (Array.isArray(arguments[0])) {
        tracks = arguments[0];
        //Also allow [stream1, stream2] etc
    }
		tracks = tracks.filter(i => i);
    let newStream = new MediaStream();
    tracks.forEach(i=>newStream.addTrack(i));
    return newStream;
}

[...document.querySelectorAll(".buttons button")].forEach(i => ripple(i, {opacity: 1, event: "mousedown", time: 300}))
function ripple(el, opts = {}) {
    const time = (opts.time || +el.getAttribute("data-time") || 1000) * 3;
    const color = opts.color || el.getAttribute("data-color") || "currentColor";
    const opacity = opts.opacity || el.getAttribute("data-opacity") || ".3";
    const event = opts.event || el.getAttribute("data-event") || "click";
    el.style.overflow = "hidden";
    el.style.position = "relative";
    el.addEventListener(event, (e) => {
        if (el.disabled) return;
        var ripple_div = document.createElement("DIV");
        ripple_div.style.position = "absolute";
        ripple_div.style.background = `${color}`;
        ripple_div.style.borderRadius = "50%";
        var bx = el.getBoundingClientRect();
        var largestdemensions;
        if (bx.width > bx.height) {
            largestdemensions = bx.width * 3;
        } else {
            largestdemensions = bx.height * 3;
        }
        ripple_div.style.pointerEvents = "none";
        ripple_div.style.height = `${largestdemensions}px`;
        ripple_div.style.width = `${largestdemensions}px`;
        ripple_div.style.transform = `translate(-50%, -50%) scale(0)`;
        ripple_div.style.top = `${e.pageY - (bx.top + window.scrollY)}px`;
        ripple_div.style.left = `${e.pageX - (bx.left + window.scrollX)}px`;
        ripple_div.style.transition = `opacity ${time}ms ease, transform ${time}ms ease`;
        ripple_div.removeAttribute("data-ripple");
        ripple_div.style.opacity = opacity;
        el.appendChild(ripple_div);
        setTimeout(() => {
        ripple_div.style.transform = `translate(-50%, -50%) scale(1)`;
        ripple_div.style.opacity = "0";
        setTimeout(() => {
            ripple_div.remove();
        }, time);
        }, 1);
    });
}