interface IConstants {
	// WhatsApp status broadcast
	statusBroadcast: string;
	// WhatsApp session storage
	sessionData: string;
}

const constants: IConstants = {
	statusBroadcast: "status@broadcast",
	sessionData: "./session/session.json"
};

export default constants;
