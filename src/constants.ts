interface IConstants {
	// WhatsApp status broadcast
	statusBroadcast: string;
	// WhatsApp session storage
	sessionPath: string;
}

const constants: IConstants = {
	statusBroadcast: "status@broadcast",
	sessionPath: "./"
};

export default constants;
