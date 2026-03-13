 const mapStyles = [
   {
     elementType: "labels",
     stylers: [
       {
         visibility: "off"
       }
     ]
   },
   {
     featureType: "administrative",
     elementType: "geometry",
     stylers: [
       {
         visibility: "on"
       }
     ]
   },
   {
     featureType: "administrative.country",
     elementType: "geometry.fill",
     stylers: [
       {
         color: "#ffeb3b"
       }
     ]
   },
   {
     featureType: "administrative.country",
     elementType: "geometry.stroke",
     stylers: [
       {
         color: "black"
       },
       {
         weight: 1
       }
     ]
   },
   {
     featureType: "administrative.country",
     elementType: "labels.text",
     stylers: [
       {
         visibility: "off"
       }
     ]
   },
   {
     featureType: "administrative.land_parcel",
     stylers: [
       {
         visibility: "on"
       }
     ]
   },
   {
     featureType: "administrative.locality",
     elementType: "labels.text",
     stylers: [
       {
         visibility: "on"
       }
     ]
   },
   {
     featureType: "administrative.neighborhood",
     stylers: [
       {
         visibility: "off"
       }
     ]
   },
   {
     featureType: "administrative.province",
     elementType: "labels.text",
     stylers: [
       {
         visibility: "on"
       }
     ]
   },
   {
     featureType: "poi",
     stylers: [
       {
         visibility: "off"
       }
     ]
   },
   {
     featureType: "road",
     stylers: [
       {
         visibility: "off"
       }
     ]
   },
   {
     featureType: "road",
     elementType: "labels.icon",
     stylers: [
       {
         visibility: "off"
       }
     ]
   },
   {
     featureType: "transit",
     stylers: [
       {
         visibility: "off"
       }
     ]
   }
 ];
export { mapStyles };
