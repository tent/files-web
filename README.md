# Drop

## Setup

### Config

ENV                    | Required | Description
---------------------- | -------- | -----------
`URL`                  | Required | URL the app is mounted at.
`JSON_CONFIG_URL`      | Required | URL of the JSON config. The `Access-Control-Allow-Credentials` header must be set. Must return a 401 status if auth required via `SIGNIN_URL`.
`GLOBAL_NAV_CONFIG`    | Optional | Filesystem path to JSON file containing the global nav config as described below.
`PATH_PREFIX`          | Optional | If the app is not mounted at the domain root, you need to specify the path prefix.
`ASSETS_DIR`           | Optional | Directory assets should be compiled to (defaults to `public/assets`).
`ASSET_ROOT`           | Optional | URL prefix of where assets are located (defaults to `/assets`, e.g. an asset named `foo` would be found at `/assets/foo`).
`ASSET_CACHE_DIR`      | Optional | Filesystem path used by Sprockets to cache compiled assets.
`APP_ASSET_MANIFEST`   | Optional | Filesystem path to manifest.json.
`SESSION_SECRET`       | Optional | Set unless you want to login every time the app restarts.
`SENTRY_URL`           | Optional | Set if you want to track errors with [Sentry](https://www.getsentry.com).
`SKIP_AUTHENTICATION`  | Optional | Set if you're using the dev app but using another server for auth / serving `config.json`.
`SIGNOUT_URL`          | Optional | URL where sign-out action is located. Defaults to `/signout`.
`SIGNOUT_REDIRECT_URL` | Optional | URL to redirect to after signing out.
`SIGNIN_URL`           | Optional | URL accepting a POST request with form encoded `username` and `passphrase` to authorize `config.json`.
`ALERT_DISMISS_URL`    | Required | URL that accepts a DELETE request. `:id` is replaced with the id of the alert. Expects 200 with no body for success.

All ENV vars must be set at compile time and when running the ruby app (for development purposes only).

#### JSON config

The app requires a JSON config as shown below.

```json
{
  "credentials": {
    "id": "...",
    "hawk_key": "...",
    "hawk_algorithm": "..."
  },
  "meta": {
    "content": {
      "entity": "...",
      "profile": {},
      "servers": [
        {
          "version": "0.3",
          "preference": 0,
          "urls": {
            "oauth_auth": "...",
            "oauth_token": "...",
            "posts_feed": "...",
            "post": "...",
            "new_post": "...",
            "post_attachment": "...",
            "attachment": "...",
            "batch": "...",
            "server_info": "...",
            "discover": "..."
          }
        }
      ]
    },
    "entity": "...",
    "id": "...",
    "published_at": ...,
    "type": "https://tent.io/types/meta/v0#",
    "version": {
      "id": "...",
      "published_at": ...
    }
  }
}
```

#### Global nav config

If `GLOBAL_NAV_CONFIG` is set, this is the format the app expects to find:

```json
{
	"items": [
		{ "name": "Drop", "icon_class": "fa fa-file", "url": "http://localhost:9292", "selected": true }
	]
}
```

#### Development

`config.json` in the project root will be used if `JSON_CONFIG_URL` is not set.

#### Heroku

```
heroku create
heroku labs:enable user-env-compile
heroku config:add \
 SESSION_SECRET=$(openssl rand -hex 16 | tr -d '\r\n') \
 URL=$(heroku info -s | grep web_url | cut -f2 -d"=" | sed 's/http/https/' | sed 's/\/$//') \
 APP_ASSET_MANIFEST=./public/assets/manifest.json
git push heroku master
heroku open
```

### Compiling

Set ENV vars as needed and run

```
bundle install
bundle exec rake compile
```

### Running

In production, serve the static assets found in `ASSETS_DIR`.

For development, run `bundle exec puma` to live compile assets.

## Post Type

`https://tent.io/types/post/file/v0`

Property | Required | Type   | Description
-------- | -------- | ------ | -----------

(There are currently no properties.)

A single attachment is required.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
