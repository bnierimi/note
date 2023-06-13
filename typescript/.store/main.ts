import { Note } from './ntc'

const output = new Note().render(`
#1 Header
#2 Header
#3 Header
#4 Header
#5 Header
#6 Header

this is a *bold* tag along with an _italic_ beside a \`code\`
that should get some =highlight= yours @reb-el(http://twitter.com/radiance_be)
----
[this is the link to my bio](http://twitter.com/radiance_be)
![my image](http://static.tcitro.gg/img-f3ej9yhrio23)

> Lorem ipsum dolor sit amet consectetur adipisicing elit. \
Optio, id consectetur itaque cupiditate quaerat \
laborum sequi tempore explicabo fuga doloremque voluptate sunt omnis autem. \
Autem nemo placeat corporis deserunt fugiat!

* ore no nawa
* ryoiki
* tenkai
* sekai

- my name is
- domain
- expansion
- world

[ ] booked
[+] listed

- [ ] name

@\`
    from ntc import Note
    Note.render("One Piece")
\`

`);

console.log(output);