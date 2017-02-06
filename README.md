# mvv-stops

This is a simple script to download all [MVV](http://www.mvv-muenchen.de) stops as [GTFS-compatible CSV](https://developers.google.com/transit/gtfs/reference/stops-file).

The script uses the following endpoint:

```
http://efa.mvv-muenchen.de/ng/XSLT_COORD_REQUEST?&jsonp=&boundingBox=&boundingBoxLU={minx}%3A{miny}%3AWGS84%5BDD.DDDDD%5D&boundingBoxRL={maxx}%3A{maxy}%3AWGS84%5BDD.DDDDD%5D&coordOutputFormat=WGS84%5BGGZHTXX%5D&type_1=STOP&outputFormat=json&inclFilter=1
```

It starts from bounding box `(5, 47, 15, 56)` and works down to smaller quadrants.

The script produces CSV output in the following format:

```
"stop_id","stop_name","stop_lon","stop_lat"
"1002997","Mainburg/Kr Kelheim, Schulzentrum",11.7704454964,48.6493206962
```

# Usage

```
npm install
node index.js
```

# Disclaimer

Usage of this script may or may not be legal, use on your own risk.  
This repository provides only source code, no data.

# License

Source code is licensed under [BSD 2-clause license](LICENSE). No license and no guarantees implied on the produced data, produce and use on your own risk.