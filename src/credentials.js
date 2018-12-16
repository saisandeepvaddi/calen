// Note to developers.
// Get credentials at https://developers.google.com/calendar/quickstart/nodejs.
// Please do not use my credentials object.

const credentials = {
  installed: {
    client_id:
      "206370061322-eggpdud9ddcj5vmbkmv6slbmlrikob0i.apps.googleusercontent.com",
    project_id: "calen-1544968010649",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://www.googleapis.com/oauth2/v3/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "9_AKL0GcqGLQdtr6pK43uT4C",
    redirect_uris: ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
  }
};

module.exports = credentials;
