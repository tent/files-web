//= require cupcake-apps-bar
//= require drop
//= raven_config

CupcakeAppsBar.setItemSelected("files", true);

Drop.once('config:ready', Drop.run, null, { "args": false });
