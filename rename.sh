#!/bin/bash

dir_en="static/spec-sheets/lcda/files/en"
dir_fr="static/spec-sheets/lcda/files/fr"

for entry in `ls $dir_fr`; do
  mv $dir_fr/$entry $dir_fr/rename/${entry/.pdf/mm.pdf};
done
