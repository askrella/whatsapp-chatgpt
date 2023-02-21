interface IConstants {
	// Speech API
	speechServerUrl: string;

	// WhatsApp status broadcast
	statusBroadcast: string;

	// WhatsApp session storage
	sessionPath: string;
}

const constants: IConstants = {
	speechServerUrl: "https://speech-service.verlekar.com",
	statusBroadcast: "status@broadcast",
	sessionPath: "./"
};

export default constants;
