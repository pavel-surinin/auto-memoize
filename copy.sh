cp package.json target/js-babel/package.json
cp README.md target/js-babel/README.md
cp LICENCE target/js-babel/LICENCE
mkdir target/js-babel/typings
cp -avr target/typings/ target/js-babel
cp -avr docs/ target/js-babel