// Note to developers.
// Get credentials at https://developers.google.com/calendar/quickstart/nodejs.
// Please do not use my credentials object.

const credentials = {
	installed: {
		client_id:
			'Write your client id here, See link above',
		project_id: 'quickstart-1549193301605',
		auth_uri: 'https://accounts.google.com/o/oauth2/auth',
		token_uri: 'https://oauth2.googleapis.com/token',
		auth_provider_x509_cert_url:
			'https://www.googleapis.com/oauth2/v1/certs',
		client_secret: 'Get secret from link above',
		redirect_uris: ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost']
	}
};

module.exports = credentials;
