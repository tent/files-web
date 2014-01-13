# Drop

## Setup

### Config

ENV                  | Required | Description
-----------------    | -------- | -----------
`URL`                | Required | URL the app is mounted at.
`JSON_CONFIG_URL`    | Required | URL of the JSON config. The `Access-Control-Allow-Credentials` header must be set.
`PATH_PREFIX`        | Optional | If the app is not mounted at the domain root, you need to specify the path prefix.
`ASSETS_DIR`         | Optional | Directory assets should be compiled to (defaults to `public/assets`).
`ASSET_ROOT`         | Optional | URL prefix of where assets are located (defaults to `/assets`, e.g. an asset named `foo` would be found at `/assets/foo`).
`ASSET_CACHE_DIR`    | Optional | Filesystem path used by Sprockets to cache compiled assets.
`APP_ASSET_MANIFEST` | Optional | Filesystem path to manifest.json.
`SESSION_SECRET`     | Optional | Set unless you want to login every time the app restarts.
`SENTRY_URL`		  	 | Optional | Set if you want to track errors with [Sentry](https://www.getsentry.com).

All ENV vars must be set at compile time and when running the ruby app (for development purposes only).

#### JSON config

The app requires a JSON config as shown below.

```json
{}
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
