Yntraa Cloud API Server
==========================
This project is used as a API middleware for Yntraa Cloud API.

### Application Structure

```
app/
├── requirements.txt
├── __init__.py
├── extensions
│   └── __init__.py
└── modules
    ├── __init__.py
    ├── api
    │   └── __init__.py
    ├── auth
    │   ├── __init__.py
    │   ├── models.py
    │   ├── parameters.py
    │   └── views.py
    ├── users
    │   ├── __init__.py
    │   ├── models.py
    │   ├── parameters.py
    │   ├── permissions.py
    │   ├── resources.py
    │   └── schemas.py
    └── teams
        ├── __init__.py
        ├── models.py
        ├── parameters.py
        ├── resources.py
        └── schemas.py
```

* `app/requirements.txt` - The list of Python (PyPi) requirements.
* `app/__init__.py` - The entry point to this RESTful API Server example
  application (Flask application is created here).
* `app/extensions` - All extensions (e.g. SQLAlchemy, OAuth2) are initialized
  here and can be used in the application by importing as, for example,
  `from app.extensions import db`.
* `app/modules` - All endpoints are expected to be implemented here in logically
  separated modules. It is up to you how to draw the line to separate concerns
  (e.g. you can implement a monolith `blog` module, or split it into
  `topics`+`comments` modules).

### Module Structure

Once you added a module name into `config.ENABLED_MODULES`, it is required to
have `your_module.init_app(app, **kwargs)` function. Everything else is
completely optional. Thus, here is the required minimum:

```
your_module/
└── __init__.py
```

, where `__init__.py` will look like this:

```python
def init_app(app, **kwargs):
    pass
```

In this repo, however, `init_app` imports `resources` and registeres `api`
(an instance of (patched) `flask_restplus.Namespace`). Learn more about the
"big picture" in the next section.


Where to start reading the code?
--------------------------------

The easiest way to start the application is by using PyInvoke command `app.run`
implemented in [`tasks/app/run.py`](tasks/app/run.py):

```
$ invoke app.run
```

The command creates an application by running
[`app/__init__.py:create_app()`](app/__init__.py) function, which in its turn:

1. loads an application config;
2. initializes extensions:
   [`app/extensions/__init__.py:init_app()`](app/extensions/__init__.py);
3. initializes modules:
   [`app/modules/__init__.py:init_app()`](app/modules/__init__.py).

Modules initialization calls `init_app()` in every enabled module
(listed in `config.ENABLED_MODULES`).

Let's take `teams` module as an example to look further.
[`app/modules/teams/__init__.py:init_app()`](app/modules/teams/__init__.py)
imports and registers `api` instance of (patched) `flask_restplus.Namespace`
from `.resources`. Flask-RESTPlus `Namespace` is designed to provide similar
functionality as Flask `Blueprint`.

[`api.route()`](app/modules/teams/resources.py) is used to bind a
resource (classes inherited from `flask_restplus.Resource`) to a specific
route.

Lastly, every `Resource` should have methods which are lowercased HTTP method
names (i.e. `.get()`, `.post()`, etc). This is where users' requests end up.


Dependencies
------------

### Project Dependencies

* [**Python**](https://www.python.org/) 2.7, 3.3+ / pypy2 (2.5.0)
* [**flask-restplus**](https://github.com/noirbizarre/flask-restplus) (+
  [*flask*](http://flask.pocoo.org/))
* [**sqlalchemy**](http://www.sqlalchemy.org/) (+
  [*flask-sqlalchemy*](http://flask-sqlalchemy.pocoo.org/)) - Database ORM.
* [**sqlalchemy-utils**](https://sqlalchemy-utils.rtdf.org/) - for yntraae
  custom fields (e.g., `PasswordField`).
* [**alembic**](https://alembic.rtdf.org/) - for DB migrations.
* [**marshmallow**](http://marshmallow.rtfd.org/) (+
  [*marshmallow-sqlalchemy*](http://marshmallow-sqlalchemy.rtfd.org/),
  [*flask-marshmallow*](http://flask-marshmallow.rtfd.org/)) - for
  schema definitions. (*supported by the patched Flask-RESTplus*)
* [**webargs**](http://webargs.rtfd.org/) - for parameters (input arguments).
  (*supported by the patched Flask-RESTplus*)
* [**apispec**](http://apispec.rtfd.org/) - for *marshmallow* and *webargs*
  introspection. (*integrated into the patched Flask-RESTplus*)
* [**oauthlib**](http://oauthlib.rtfd.org/) (+
  [*flask-oauthlib*](http://flask-oauthlib.rtfd.org/)) - for authentication.
* [**flask-login**](http://flask-login.rtfd.org/) - for `current_user`
  integration only.
* [**bcrypt**](https://github.com/pyca/bcrypt/) - for password hashing (used as
  a backend by *sqlalchemy-utils.PasswordField*).
* [**permission**](https://github.com/hustlzp/permission) - for authorization.
* [**Swagger-UI**](https://github.com/swagger-api/swagger-ui) - for interactive
  RESTful API documentation. 

### Build Dependencies

We have used [`pyinvoke`](http://pyinvoke.org) with custom tasks to maintain easy and
nice command-line interface. Thus, it is required to have `invoke` Python
package installed, and optionally you may want to install `colorlog`, so your
life become colorful.

### Patched Dependencies

* **flask-restplus** is patched to handle marshmallow schemas and webargs
  input parameters
  ([GH #9](https://github.com/noirbizarre/flask-restplus/issues/9)).
* **swagger-ui** (*the bundle is automatically downloaded on the first run*)
  just includes a pull-request to support Resource Owner Password Credentials
  Grant OAuth2 (aka Password Flow)
  ([PR #1853](https://github.com/swagger-api/swagger-ui/pull/1853)).


#### Setup Environment

It is recommended to use virtualenv or Anaconda/Miniconda to manage Python
dependencies. Please, learn details yourself.

You will need `invoke` package to work with everything related to this project.

```bash
$ pip install -r tasks/requirements.txt
```


#### Run Server

NOTE: All dependencies and database migrations will be automatically handled,
so go ahead and turn the server ON! (Read more details on this in Tips section)

```bash
$ invoke app.run
```

#### Deploy Server

In general, you deploy this app as any other Flask/WSGI application. There are
a few basic deployment strategies documented in the [`./deploy/`](./deploy/)
folder.


Quickstart
----------

Open online interactive API documentation:
[http://127.0.0.1:5000/api/v1/](http://127.0.0.1:5000/api/v1/)

Autogenerated swagger config is always available from
[http://127.0.0.1:5000/api/v1/swagger.json](http://127.0.0.1:5000/api/v1/swagger.json)

`example.db` (SQLite) includes 2 users:

* Admin user `root` with password `q`
* Regular user `user` with password `w`

NOTE: Use On/Off switch in documentation to sign in.


Authentication Details
----------------------

This example server features OAuth2 Authentication protocol support, but don't
be afraid of it! If you learn it, OAuth2 will save you from a lot of troubles.

### Authentication with Login and Password (Resource Owner Password Credentials Grant)

Here is how you authenticate with user login and password credentials using cURL:

```
$ curl 'http://127.0.0.1:5000/auth/oauth2/token?grant_type=password&client_id=documentation&username=root&password=q'
{
    "token_type": "Bearer",
    "access_token": "oqvUpO4aKg5KgYK2EUY2HPsbOlAyEZ",
    "refresh_token": "3UTjLPlnomJPx5FvgsC2wS7GfVNrfH",
    "expires_in": 3600,
    "scope": "auth:read auth:write users:read users:write teams:read teams:write"
}
```

That is it!

Well, the above request uses query parameters to pass client ID, user login and
password which is not recommended (even discouraged) for production use since
most of the web servers logs the requested URLs in plain text and we don't want
to leak sensitive data this way.  Thus, in practice you would use form
parameters to pass credentials:

```
$ curl 'http://127.0.0.1:5000/auth/oauth2/token?grant_type=password' -F 'client_id=documentation' -F 'username=root' -F 'password=q'
```

, or even pass `client_id` as Basic HTTP Auth:

```
$ curl 'http://127.0.0.1:5000/auth/oauth2/token?grant_type=password' --user 'documentation:' -F 'username=root' -F 'password=q'
```

You grab the `access_token` and put it into `Authorization` header
to request "protected" resources:

```
$ curl --header 'Authorization: Bearer oqvUpO4aKg5KgYK2EUY2HPsbOlAyEZ' 'http://127.0.0.1:5000/api/v1/users/me'
{
    "id": 1,
    "username": "root",
    "email": "root@localhost",
    "first_name": "",
    "middle_name": "",
    "last_name": "",
    "is_active": true,
    "is_regular_user": true,
    "is_admin": true,
    "created": "2016-10-20T14:00:35.912576+00:00",
    "updated": "2016-10-20T14:00:35.912602+00:00"
}
```

Once the access token expires, you can refresh it with `refresh_token`. To do
that, OAuth2 RFC defines Refresh Token Flow (notice that there is no need to
store user credentials to do the refresh procedure):

```
$ curl 'http://127.0.0.1:5000/auth/oauth2/token?grant_type=refresh_token' --user 'documentation:' -F 'refresh_token=3UTjLPlnomJPx5FvgsC2wS7GfVNrfH'
{
    "token_type": "Bearer",
    "access_token": "FwaS90XWwBpM1sLeAytaGGTubhHaok",
    "refresh_token": "YD5Rc1FojKX1ZY9vltMSnFxhm9qpbb",
    "expires_in": 3600,
    "scope": "auth:read auth:write users:read users:write teams:read teams:write"
}
```

### Authentication with Client ID and Secret (Client Credentials Grant)

Here is how you authenticate with user login and password credentials using cURL:

```
$ curl 'http://127.0.0.1:5000/auth/oauth2/token?grant_type=client_credentials' --user 'documentation:KQ()SWK)SQK)QWSKQW(SKQ)S(QWSQW(SJ*HQ&HQW*SQ*^SSQWSGQSG'
{
    "token_type": "Bearer",
    "access_token": "oqvUpO4aKg5KgYK2EUY2HPsbOlAyEZ",
    "expires_in": 3600,
    "scope": "teams:read users:read users:write teams:write"
}
```

The same way as in the previous section, you can grab the `access_token` and
access protected resources.



Tips
----

Once you have invoke, you can learn all available commands related to this
project from:

```bash
$ invoke --list
```

Learn more about each command with the following syntax:

```bash
$ invoke --help <task>
```

For example:

```bash
$ invoke --help app.run
Usage: inv[oke] [--core-opts] app.run [--options] [other tasks here ...]

Docstring:
  Run DDOTS RESTful API Server.

Options:
  -d, --[no-]development
  -h STRING, --host=STRING
  -i, --[no-]install-dependencies
  -p, --port
  -u, --[no-]upgrade-db
```

Use the following command to enter ipython shell (`ipython` must be installed):

```bash
$ invoke app.env.enter
```

`app.run` and `app.env.enter` tasks automatically prepare all dependencies
(using `pip install`) and migrate database schema to the latest version.

Database schema migration is handled via `app.db.*` tasks group. The most
common migration commands are `app.db.upgrade` (it is automatically run on
`app.run`), and `app.db.migrate` (creates a new migration).

You can use [`better_exceptions`](https://github.com/Qix-/better-exceptions)
package to enable detailed tracebacks. Just add `better_exceptions` to the
`app/requirements.txt` and `import better_exceptions` in the `app/__init__.py`.


Marshmallow Tricks
------------------

There are a few helpers already available in the `flask_restplus_patched`:

* `flask_restplus_patched.parameters.Parameters` - base class, which is a thin
  wrapper on top of Marshmallow Schema.
* `flask_restplus_patched.parameters.PostFormParameters` - a helper class,
  which automatically mark all the fields that has no explicitly defined
  location to be form data parameters.
* `flask_restplus_patched.parameters.PatchJSONParameters` - a helper class for
  the common use-case of [RFC 6902](http://tools.ietf.org/html/rfc6902)
  describing JSON PATCH.
* `flask_restplus_patched.namespace.Namespace.parameters` - a helper decorator,
  which automatically handles and documents the passed `Parameters`.

You can find the examples of the usage throughout the code base (in
`/app/modules/*`).


### JSON Parameters

While there is an implementation for JSON PATCH Parameters, there are other
use-cases, where you may need to handle JSON as input parameters. Naturally,
JSON input is just a form data body text which is treated as JSON on a server
side, so you only need define a single variable called `body` with
`location='json'`:

```python
class UserSchema(Schema):
    id = base_fields.Integer(required=False)
    username = base_fields.String(required=True)


class MyObjectSchema(Schema):
    id = base_fields.Integer(required=True)
    priority = base_fields.String(required=True)
    owner = base_fields.Nested(UserSchema, required=False)


class CreateMyObjectParameters(Parameters):
    body = base_fields.Nested(MyObjectSchema, location='json', required=True)


api = Namespace('my-objects-controller', description="My Objects Controller", path='/my-objects')


@api.route('/')
class MyObjects(Resource):
    """
    Manipulations with My Objects.
    """

    @api.parameters(CreateMyObjectParameters())
    @api.response(MyObjectSchema())
    @api.response(code=HTTPStatus.CONFLICT)
    @api.doc(id='create_my_object')
    def post(self, args):
        """
        Create a new My Object.
        """
        return create_my_object(args)
``` 
