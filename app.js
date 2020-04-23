var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

var methodOverride = require('method-override');
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

const db = require('./models/index');

//メッセージcrud
//一覧表示
app.get('/',(req,res)=>{
  db.message.findAll().then((results)=>{
    res.render('index.ejs', {messages: results});
  });
});
//投稿ページ
app.get('/messages/new',(req,res)=> {
  res.render('new.ejs');
});

//新規投稿
app.post('/messages',(req,res) => {
  const newMessage = {
    content: req.body.messageContent
  };
  db.message.create(newMessage).then((results) =>{
    res.redirect('/');
  });
});

//メッセージ編集
app.get('/messages/:id/edit', (req,res) => {
  db.message.findByPk(req.params.id).then((results) => {
  res.render('edit.ejs', {message :results});
  });
});

//メッセージ更新
app.put('/messages/:id', (req,res) => {
  const updatedMessage = {
   content: req.body.messageContent
  };
  const options = {
    where: {
      id: req.params.id
  }};
  db.message.update(updatedMessage, options).then((results) => {
    res.redirect('/');
  });
});

//メッセージ削除
app.delete('/messages/:id', (req,res) =>{
  const options = {
    where: {
      id: req.params.id
    }};
    db.message.destroy(options).then((results) =>{
      res.redirect('/');
    });
});

//詳細
app.get('/messages/:id',(req,res) => {
  const options = {
    include: [{
      model: db.reply
    }]
  };
  db.message.findByPk( req.params.id,options).then((results)=>{
    res.render('show.ejs', {message: results});
    console.log(results.message);

  });
});



//返信
app.post('/replies/:id', (req,res) => {
  const newReply = {
    content: req.body.replyContent,
    message_id: req.params.id
  }; 
  const options = {
    where: {
      id: req.params.id
  }};
  db.reply.create(newReply, options).then((results) => {
    res.redirect('/');
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
