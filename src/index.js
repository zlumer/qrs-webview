window.RTCHelper = require('./webrtc').RTCHelper;
// window.JSONRPC = require('./jsonrpc');

window.addEventListener("message", receiveMessage);
document.addEventListener("message", receiveMessage);

// msg("hello", "world")

var IDCOL = {};

function receiveMessage(event)
{
	var id = undefined
	try
	{
		// window.postMessage('01')
		// window.postMessage(`${window.RTCHelper}`)
		// window.postMessage(`${window.RTCHelper.toString()}`)
		// window.postMessage(`${JSON.stringify(window.RTCHelper)}`)
		var json = JSON.parse(event.data);
		id = json.id
		if (!json.method)
			return
		
		// window.postMessage("1")
		
		if (IDCOL[id])
			return;
		
		// window.postMessage(`2. json id: ${id}`)
		
		IDCOL[id] = 1;
		
		// window.postMessage("3")
		
		var m = json.method + "";
		
		// window.postMessage("4")

		if (m.startsWith('webrtc.'))
		{
			// window.postMessage("5")
			let method = m.replace('webrtc.', '')
			// window.postMessage(`5.1. ${method}()`)
			var func = RPC_HANDLER[method]
			// window.postMessage("6. " + func)
			if (!func)
			{
				// window.postMessage(`6.1. id: ${id}, m: ${m}, err: ${err}`)
				err(id, `method ${m} not found!`);
				return;
			}
			
			// window.postMessage("7")
			func(json)
			// window.postMessage("8")
		}
		// window.postMessage("41")
	}
	catch (e)
	{
		err(id, e)
	}
}

var rtc;

var rpcId = 1;
function msg(method, ...args)
{
	window.postMessage(JSON.stringify({ id: rpcId++, method, params: args, jsonrpc: '2.0' }))
}
function answer(id, result)
{
	window.postMessage(JSON.stringify({ id, result, jsonrpc: '2.0' }))
}
function err(id, e)
{
	let msg = e && e.message
	let type = Object.prototype.toString.apply(e).replace(/^\[object (.*)\]$/, "$1")
	window.postMessage(JSON.stringify({ id, error: { msg, type, e }, jsonrpc: '2.0' }))
}

var RPC_HANDLER = {
	init(jrpc)
	{
		if (!rtc)
		{
			rtc = new window.RTCHelper();
			rtc.on('ice', cand => msg('webrtc.ice', cand));
			rtc.on('connected', () => msg('webrtc.connected'));
			rtc.onMessage = ev => msg("webrtc.incoming", JSON.parse(ev.data.toString()));
		}
		answer(jrpc.id, true)
	},
	createOffer(jrpc)
	{
		rtc.createOffer().then(offer => answer(jrpc.id, offer))
	},
	pushOffer(jrpc)
	{
		rtc.pushOffer(jrpc.params.offer || jrpc.params[0]).then(a => answer(jrpc.id, a)).catch(e => err(jrpc.id, e))
	},
	pushAnswer(jrpc)
	{
		rtc.pushAnswer(jrpc.params.answer || jrpc.params[0]).then(() => answer(jrpc.id, null)).catch(e => err(jrpc.id, e))
	},
	pushIceCandidate(jrpc)
	{
		rtc.pushIceCandidate(jrpc.params.candidate || jrpc.params[0]).then(() => answer(jrpc.id, null)).catch(e => err(jrpc.id, e))
	},
	send(jrpc)
	{
		rtc.dataChannel.send(jrpc.params.msg || jrpc.params[0]).then(() => answer(jrpc.id, null)).catch(e => err(jrpc.id, e))
	},
}