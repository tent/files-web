# Files

## Setup

### Config

ENV                    | Required | Description
---------------------- | -------- | -----------
`URL`                  | Required | URL the app is mounted at.
`JSON_CONFIG_URL`      | Required | URL of the JSON config. The `Access-Control-Allow-Credentials` header must be set. Must return a 401 status if auth required via `SIGNIN_URL`.
`CONTACTS_URL`         | Required | URL pointing to an instance of the [Contacts Service](https://github.com/cupcake/contacts-service) (loaded inside an iframe). Note that `frame-src` and `frame-ancestors` CSP headers need to be set appropriately.
`PATH_PREFIX`          | Optional | If the app is not mounted at the domain root, you need to specify the path prefix.
`ASSETS_DIR`           | Optional | Directory assets should be compiled to (defaults to `public/assets`).
`SENTRY_URL`           | Optional | Set if you want to track errors with [Sentry](https://www.getsentry.com).
`SHORTENER_URL`        | Optional | URL accepting a JSON POST request with `{"long_url": "https://..."}` and returning the same object with an added `short_url` member. This URL must have CORS headers setup.
`SKIP_AUTHENTICATION`  | Optional | Set if you're using the dev app but using another server for auth / serving config JSON.
`SIGNIN_URL`           | Optional | URL accepting a POST request with form encoded `username` and `passphrase` to authorize `config.json`.
`SIGNOUT_URL`          | Optional | URL where sign-out action is located.
`SIGNOUT_REDIRECT_URL` | Optional | URL to redirect to after signing out.

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

#### App permissions

Write permissions for `https://tent.io/types/file/v0` and the `permissions` scope are required for all features to work as expected.

#### Heroku

```
heroku create
heroku labs:enable user-env-compile
heroku config:add \
 SESSION_SECRET=$(openssl rand -hex 16 | tr -d '\r\n') \
 URL=$(heroku info -s | grep web_url | cut -f2 -d"=" | sed 's/http/https/' | sed 's/\/$//')
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

[jsxhint](https://github.com/STRML/JSXHint) must pass using the project's `.jshintrc` config.

Note that the actual Javascript application is located in `lib/assets/javascripts`. [Sprockets](https://github.com/sstephenson/sprockets) is used to compile and concatenate files.

## See also

- [React](https://facebook.github.io/react/)
- [Marbles](https://github.com/jvatic/marbles-js)
- [static-sprockets](https://github.com/jvatic/static-sprockets)
- [static-sprockets-tent](https://github.com/jvatic/static-sprockets-tent)
