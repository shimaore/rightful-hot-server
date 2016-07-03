    ConnectRedis = require 'connect-redis'
    SocketIORedisStore = require 'socket.io-redis'
    UUID = require 'uuid'

    @include = ->

      if @cfg.redis?

        # @use 'cookie-parser'

Express Session Store
---------------------

See https://github.com/zappajs/zappajs/blob/1.x/examples/redis_setup.coffee for prod

        redis_config = @cfg.redis

        ExpressRedisStore = ConnectRedis @session

We use ZappaJS's session module, which allows sharing between ExpressJS and Socket.IO (even on different servers when using Redis or another shared back-end).

        @use session:
          store: new ExpressRedisStore redis_config
          secret: cfg.redis.secret ? 'rock zappa rock'
          resave: true
          saveUninitialized: true

Socket.io Session Store
-----------------------

Optional: use this to allow broadcast across multiple Socket.IO instances.

        @io.adapter SocketIORedisStore redis_config

      else

Memory Session Store
--------------------

This is for dev/test only, we're using https://github.com/expressjs/session#example

Sessions are shared between ExpressJS and Socket.io but not between multiple instances, and more importantly this session leaks memory at a fast pace.

        {MemoryStore} = @session

        @use session:
          store: new MemoryStore()
          secret: UUID.v4()
          resave: true
          saveUninitialized: true
