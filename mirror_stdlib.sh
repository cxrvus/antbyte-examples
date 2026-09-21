DEST=../antbyte/src/parser/compiler/stdlib.rs
echo "pub const STDLIB: &str = r#\"" > $DEST
cat lib/std.ant >> $DEST
echo "\"#;" >> $DEST
