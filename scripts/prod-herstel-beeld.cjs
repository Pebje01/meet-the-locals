/**
 * GEGENEREERD door scripts/maak-prod-script.ts. Niet met de hand aanpassen.
 *
 * Zet de beeldkoppeling van bestemmingen, blogposts en verhalen op productie
 * gelijk aan lokaal. De beelden staan al in de gedeelde S3-bucket; alleen de
 * koppeling zit in de database en die is per omgeving.
 *
 *   node prod-herstel-beeld.cjs --dry
 *   node prod-herstel-beeld.cjs
 */

const { Client } = require('pg')
const dry = process.argv.includes('--dry')

const MEDIA = [
  {
    "filename": "trulli-home-3.webp",
    "alt": "Twee trulli met kegeldaken en een terras onder een blauwe lucht",
    "caption": "Ceglie Messapica, Apulië",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 406716,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/trulli-home-3.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "trulli-lupoli-33.webp",
    "alt": "Groep trulli met witte kegeldaken en een terras",
    "caption": "Ceglie Messapica, Apulië",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 378732,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/trulli-lupoli-33.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "trulli-lupoli-32.webp",
    "alt": "Twee trulli met een blauwe deur en stenen muur",
    "caption": "Ceglie Messapica, Apulië",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 427166,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/trulli-lupoli-32.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "trulli-lupoli-36.webp",
    "alt": "Tuin met olijfbomen en droge stenen muurtjes",
    "caption": "Valle d Itria, Apulië",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 853818,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/trulli-lupoli-36.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "trulli-lupoli-39.webp",
    "alt": "Wit gepleisterd gebouw met blauwe deur en een boom ervoor",
    "caption": "Ceglie Messapica, Apulië",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 684890,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/trulli-lupoli-39.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "trulli-lupoli-37.webp",
    "alt": "Pergola met tafel en stoelen op een binnenplaats van natuursteen",
    "caption": "Ceglie Messapica, Apulië",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 547220,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/trulli-lupoli-37.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "trulli-lupoli-31.webp",
    "alt": "Trullo tussen de bomen in het Apulische landschap",
    "caption": "Ceglie Messapica, Apulië",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 572732,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/trulli-lupoli-31.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "trulli-lupoli-34.webp",
    "alt": "Trullo aan het einde van een pad met bomen eromheen",
    "caption": "Ceglie Messapica, Apulië",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 789956,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/trulli-lupoli-34.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "trulli-lupoli-35.webp",
    "alt": "Oprit met hek en auto naar een trullo tussen de bomen",
    "caption": "Ceglie Messapica, Apulië",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 806836,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/trulli-lupoli-35.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "trulli-lupoli-38.webp",
    "alt": "Trullo met blauw luik en een terras in de middagzon",
    "caption": "Ceglie Messapica, Apulië",
    "width": 1920,
    "height": 2886,
    "mimeType": "image/webp",
    "filesize": 542640,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/trulli-lupoli-38.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "como-italia086-correct.webp",
    "alt": "Uitzicht over het Comomeer, Italië",
    "caption": null,
    "width": 1440,
    "height": 1920,
    "mimeType": "image/webp",
    "filesize": 661978,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/como-italia086-correct.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "newyork-1-scaled.webp",
    "alt": "newyork (1)",
    "caption": "",
    "width": 1600,
    "height": 1064,
    "mimeType": "image/webp",
    "filesize": 358626,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/newyork-1-scaled.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "newyork-taxi.webp",
    "alt": "Gele taxi in een straat in Manhattan met stoom uit het wegdek",
    "caption": "Midtown Manhattan, New York",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 374902,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/newyork-taxi.webp",
    "exif": {
      "camera": "NIKON D780",
      "lens": "VR 15-30mm f/2.8G",
      "aperture": "f/4.5",
      "shutterSpeed": "1/60s",
      "iso": "50",
      "focalLength": "19mm",
      "takenAt": "2026-08-22T20:58:39.000Z",
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "newyork-vessel.webp",
    "alt": "The Vessel in Hudson Yards met een kleurrijke muurschildering ernaast",
    "caption": "Hudson Yards, New York",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 466188,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/newyork-vessel.webp",
    "exif": {
      "camera": "NIKON D780",
      "lens": "VR 15-30mm f/2.8G",
      "aperture": "f/14",
      "shutterSpeed": "1/320s",
      "iso": "80",
      "focalLength": "15mm",
      "takenAt": "2026-08-23T16:53:18.000Z",
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "image929.webp",
    "alt": "image929.jpg",
    "caption": "",
    "width": 982,
    "height": 827,
    "mimeType": "image/webp",
    "filesize": 66690,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/image929.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "DJI_20240517152816_0082_D-scaled.webp",
    "alt": "Tumpak Sewu waterval Oost-java Indonesie",
    "caption": "Tumpak Sewu waterval Oost-java Indonesie",
    "width": 1600,
    "height": 900,
    "mimeType": "image/webp",
    "filesize": 374984,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/DJI_20240517152816_0082_D-scaled.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "Cameronhighlands-1-scaled.webp",
    "alt": "Cameronhighlands",
    "caption": "",
    "width": 1600,
    "height": 1064,
    "mimeType": "image/webp",
    "filesize": 412444,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/Cameronhighlands-1-scaled.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "maleisie-7-scaled.webp",
    "alt": "Glooiende theevelden in de Cameron Highlands",
    "caption": null,
    "width": 1600,
    "height": 1064,
    "mimeType": "image/webp",
    "filesize": 217588,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/maleisie-7-scaled.webp",
    "exif": {
      "camera": "Sony A7 IV",
      "lens": "Sony FE 24-70mm f/2.8 GM",
      "aperture": "f/2.8",
      "shutterSpeed": "1/320s",
      "iso": "320",
      "focalLength": "50mm",
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "langkawi-scaled.webp",
    "alt": "Zonsondergang boven de eilanden van Langkawi",
    "caption": null,
    "width": 1600,
    "height": 1064,
    "mimeType": "image/webp",
    "filesize": 175554,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/langkawi-scaled.webp",
    "exif": {
      "camera": "Sony A7 IV",
      "lens": "Sony FE 70-200mm f/4 G",
      "aperture": "f/5.6",
      "shutterSpeed": "1/1000s",
      "iso": "200",
      "focalLength": "135mm",
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "ombakvilla-scaled.webp",
    "alt": "ombakvilla",
    "caption": "",
    "width": 1600,
    "height": 1066,
    "mimeType": "image/webp",
    "filesize": 331808,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/ombakvilla-scaled.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "bangkok-scaled.webp",
    "alt": "Bloemenmarkt in Bangkok bij ochtendlicht",
    "caption": null,
    "width": 1600,
    "height": 1064,
    "mimeType": "image/webp",
    "filesize": 451998,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/bangkok-scaled.webp",
    "exif": {
      "camera": "Sony A7 IV",
      "lens": "Sony FE 24-70mm f/2.8 GM",
      "aperture": "f/4",
      "shutterSpeed": "1/250s",
      "iso": "400",
      "focalLength": "35mm",
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "Ayuthayya-1-2-scaled.webp",
    "alt": "Oude tempelruïnes in Ayutthaya",
    "caption": null,
    "width": 1600,
    "height": 1064,
    "mimeType": "image/webp",
    "filesize": 325906,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/Ayuthayya-1-2-scaled.webp",
    "exif": {
      "camera": "Sony A7 IV",
      "lens": "Sony FE 16-35mm f/2.8 GM",
      "aperture": "f/8",
      "shutterSpeed": "1/500s",
      "iso": "100",
      "focalLength": "24mm",
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "Batucaves-6-scaled.webp",
    "alt": "De kleurrijke trap naar Batu Caves",
    "caption": null,
    "width": 1600,
    "height": 1064,
    "mimeType": "image/webp",
    "filesize": 238796,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/Batucaves-6-scaled.webp",
    "exif": {
      "camera": "Sony A7 III",
      "lens": "Sony FE 16-35mm f/2.8 GM",
      "aperture": "f/5.6",
      "shutterSpeed": "1/160s",
      "iso": "800",
      "focalLength": "18mm",
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "Malaysia-1-7-1-scaled.webp",
    "alt": "Malaysia-1-7",
    "caption": "",
    "width": 1600,
    "height": 1064,
    "mimeType": "image/webp",
    "filesize": 230898,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/Malaysia-1-7-1-scaled.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "maleisie-5-scaled.webp",
    "alt": "maleisie-5",
    "caption": "",
    "width": 1600,
    "height": 1064,
    "mimeType": "image/webp",
    "filesize": 421310,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/maleisie-5-scaled.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "maleisie-6-scaled.webp",
    "alt": "maleisie-6",
    "caption": "",
    "width": 1600,
    "height": 1064,
    "mimeType": "image/webp",
    "filesize": 223440,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/maleisie-6-scaled.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "kellys-scaled.webp",
    "alt": "kellys",
    "caption": "",
    "width": 1600,
    "height": 1066,
    "mimeType": "image/webp",
    "filesize": 368602,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/kellys-scaled.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "japan-fuji-chureito.webp",
    "alt": "De Chureito-pagode met de berg Fuji op de achtergrond",
    "caption": "Chureito-pagode, Fujiyoshida",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 360320,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/japan-fuji-chureito.webp",
    "exif": {
      "camera": "NIKON D780",
      "lens": "24-70mm f/2.8G",
      "aperture": "f/11",
      "shutterSpeed": "1/500s",
      "iso": "80",
      "focalLength": "36mm",
      "takenAt": "2024-03-21T11:51:37.000Z",
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "japan-fuji-drone.webp",
    "alt": "De berg Fuji boven het Kawaguchiko-meer, gezien vanuit de lucht",
    "caption": "Kawaguchiko, Yamanashi",
    "width": 1920,
    "height": 1080,
    "mimeType": "image/webp",
    "filesize": 290540,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/japan-fuji-drone.webp",
    "exif": {
      "camera": "DJI FC8482",
      "lens": "24.0 mm f/1.7",
      "aperture": "f/1.7",
      "shutterSpeed": "1/80s",
      "iso": "100",
      "focalLength": "7mm",
      "takenAt": "2024-03-21T15:31:35.000Z",
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "japan-shirakawago-winter.webp",
    "alt": "Het dorp Shirakawa-go in de sneeuw, gezien vanuit de lucht",
    "caption": "Shirakawa-go, Gifu",
    "width": 1920,
    "height": 1080,
    "mimeType": "image/webp",
    "filesize": 498968,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/japan-shirakawago-winter.webp",
    "exif": {
      "camera": "DJI FC8482",
      "lens": "24.0 mm f/1.7",
      "aperture": "f/1.7",
      "shutterSpeed": "1/80s",
      "iso": "100",
      "focalLength": "7mm",
      "takenAt": "2024-03-16T14:42:39.000Z",
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "japan-shirakawago-daken.webp",
    "alt": "Rieten daken van Shirakawa-go onder een laag sneeuw",
    "caption": "Shirakawa-go, Gifu",
    "width": 1920,
    "height": 1080,
    "mimeType": "image/webp",
    "filesize": 576726,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/japan-shirakawago-daken.webp",
    "exif": {
      "camera": "DJI FC8482",
      "lens": "24.0 mm f/1.7",
      "aperture": "f/1.7",
      "shutterSpeed": "1/80s",
      "iso": "100",
      "focalLength": "7mm",
      "takenAt": "2024-03-16T14:48:03.000Z",
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "japan-nara-hert.webp",
    "alt": "Een hert bij een informatiebord in het park van Nara",
    "caption": "Nara-park, Nara",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 225860,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/japan-nara-hert.webp",
    "exif": {
      "camera": "NIKON D780",
      "lens": "24-70mm f/2.8G",
      "aperture": "f/2.8",
      "shutterSpeed": "1/500s",
      "iso": "80",
      "focalLength": "24mm",
      "takenAt": "2024-03-11T04:44:14.000Z",
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "japan-tokyo-rivier.webp",
    "alt": "Gebouwen langs de Sumida-rivier in Tokio met een rondvaartboot",
    "caption": "Sumida, Tokio",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 495596,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/japan-tokyo-rivier.webp",
    "exif": {
      "camera": "NIKON D780",
      "lens": "80-200mm f/2.8",
      "aperture": "f/9",
      "shutterSpeed": "1/125s",
      "iso": "50",
      "focalLength": "200mm",
      "takenAt": "2024-03-20T12:11:57.000Z",
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "japan-tokyo-uitzicht.webp",
    "alt": "Bezoekers bij het raam met uitzicht over Tokio",
    "caption": "Tokyo Skytree, Tokio",
    "width": 1920,
    "height": 1278,
    "mimeType": "image/webp",
    "filesize": 307218,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/japan-tokyo-uitzicht.webp",
    "exif": {
      "camera": "NIKON D780",
      "lens": "24-70mm f/2.8G",
      "aperture": "f/7.1",
      "shutterSpeed": "1/160s",
      "iso": "50",
      "focalLength": "50mm",
      "takenAt": "2024-03-20T13:29:16.000Z",
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "japan-kersenbloesem.webp",
    "alt": "Bruidspaar onder bloeiende kersenbomen in het park",
    "caption": "Shioiri-park, Tokio",
    "width": 1920,
    "height": 2561,
    "mimeType": "image/webp",
    "filesize": 502382,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/japan-kersenbloesem.webp",
    "exif": {
      "camera": "NIKON D780",
      "lens": "80-200mm f/2.8",
      "aperture": "f/2.8",
      "shutterSpeed": "1/200s",
      "iso": "50",
      "focalLength": "116mm",
      "takenAt": "2024-03-20T10:53:17.000Z",
      "latitude": null,
      "longitude": null
    }
  },
  {
    "filename": "cusco-12-scaled.webp",
    "alt": "cusco-12",
    "caption": "",
    "width": 1600,
    "height": 1200,
    "mimeType": "image/webp",
    "filesize": 425812,
    "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/cusco-12-scaled.webp",
    "exif": {
      "camera": null,
      "lens": null,
      "aperture": null,
      "shutterSpeed": null,
      "iso": null,
      "focalLength": null,
      "takenAt": null,
      "latitude": null,
      "longitude": null
    }
  }
]

const PLAN = {
  "destinations": [
    {
      "slug": "apulie",
      "hero": "trulli-home-3.webp",
      "gallery": [
        "trulli-lupoli-33.webp",
        "trulli-lupoli-32.webp",
        "trulli-lupoli-36.webp",
        "trulli-lupoli-39.webp",
        "trulli-lupoli-37.webp"
      ]
    },
    {
      "slug": "valle-ditria",
      "hero": "trulli-lupoli-31.webp",
      "gallery": [
        "trulli-lupoli-34.webp",
        "trulli-lupoli-35.webp",
        "trulli-lupoli-38.webp",
        "trulli-lupoli-36.webp"
      ]
    },
    {
      "slug": "italie",
      "hero": "como-italia086-correct.webp",
      "gallery": [
        "trulli-home-3.webp",
        "trulli-lupoli-33.webp"
      ]
    },
    {
      "slug": "comomeer",
      "hero": "como-italia086-correct.webp",
      "gallery": []
    },
    {
      "slug": "lombardije",
      "hero": "como-italia086-correct.webp",
      "gallery": []
    },
    {
      "slug": "new-york",
      "hero": "newyork-1-scaled.webp",
      "gallery": [
        "newyork-taxi.webp",
        "newyork-vessel.webp"
      ]
    },
    {
      "slug": "java",
      "hero": "image929.webp",
      "gallery": [
        "DJI_20240517152816_0082_D-scaled.webp"
      ]
    },
    {
      "slug": "indonesie",
      "hero": "DJI_20240517152816_0082_D-scaled.webp",
      "gallery": [
        "image929.webp"
      ]
    },
    {
      "slug": "cameron-highlands",
      "hero": "Cameronhighlands-1-scaled.webp",
      "gallery": [
        "maleisie-7-scaled.webp"
      ]
    },
    {
      "slug": "langkawi",
      "hero": "langkawi-scaled.webp",
      "gallery": [
        "ombakvilla-scaled.webp"
      ]
    },
    {
      "slug": "bangkok",
      "hero": "bangkok-scaled.webp",
      "gallery": [
        "Ayuthayya-1-2-scaled.webp"
      ]
    },
    {
      "slug": "maleisie",
      "hero": "maleisie-7-scaled.webp",
      "gallery": [
        "Batucaves-6-scaled.webp",
        "Cameronhighlands-1-scaled.webp",
        "langkawi-scaled.webp",
        "Malaysia-1-7-1-scaled.webp",
        "maleisie-5-scaled.webp",
        "maleisie-6-scaled.webp",
        "ombakvilla-scaled.webp",
        "kellys-scaled.webp"
      ]
    },
    {
      "slug": "japan",
      "hero": "japan-fuji-chureito.webp",
      "gallery": [
        "japan-fuji-drone.webp",
        "japan-shirakawago-winter.webp",
        "japan-shirakawago-daken.webp",
        "japan-nara-hert.webp",
        "japan-tokyo-rivier.webp",
        "japan-tokyo-uitzicht.webp",
        "japan-kersenbloesem.webp"
      ]
    }
  ],
  "posts": [
    {
      "slug": "apulie-regio-overzicht",
      "hero": "trulli-home-3.webp"
    },
    {
      "slug": "apulie-leukste-dorpjes",
      "hero": "trulli-lupoli-39.webp"
    },
    {
      "slug": "locorotondo-wit-en-stil",
      "hero": "trulli-lupoli-32.webp"
    },
    {
      "slug": "valle-ditria-trulli-en-olijfbomen",
      "hero": "trulli-lupoli-36.webp"
    },
    {
      "slug": "Slow-tourism-puglia",
      "hero": "trulli-lupoli-37.webp"
    }
  ],
  "stories": [
    {
      "slug": "boven-de-wolken-in-de-andes",
      "hero": "cusco-12-scaled.webp"
    }
  ]
}

async function main() {
  const db = new Client({ connectionString: process.env.DATABASE_URI })
  await db.connect()
  try {
    if (!dry) await db.query('BEGIN')

    // Ontbrekende media-records aanmaken. Matchen op bestandsnaam, want de
    // id's lopen niet gelijk tussen lokaal en productie.
    const ids = {}
    for (const m of MEDIA) {
      const r = await db.query('select id from media where filename = $1', [m.filename])
      if (r.rows.length) { ids[m.filename] = r.rows[0].id; continue }
      if (dry) { console.log('zou aanmaken  ' + m.filename); continue }
      const next = await db.query('select coalesce(max(id),0)+1 as id from media')
      const id = next.rows[0].id
      const e = m.exif || {}
      await db.query(
        `insert into media (id, alt, caption, filename, mime_type, filesize, width, height, url,
            exif_camera, exif_lens, exif_aperture, exif_shutter_speed, exif_iso, exif_focal_length,
            updated_at, created_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15, now(), now())`,
        [id, m.alt, m.caption, m.filename, m.mimeType || 'image/webp', m.filesize || 0,
         m.width, m.height, m.url, e.camera || null, e.lens || null, e.aperture || null,
         e.shutterSpeed || null, e.iso || null, e.focalLength || null],
      )
      ids[m.filename] = id
      console.log('aangemaakt    ' + m.filename + '  id ' + id)
    }
    if (!dry) {
      await db.query("select setval(pg_get_serial_sequence('media','id'), (select max(id) from media))")
    }

    const idVan = async (fn) => {
      if (ids[fn]) return ids[fn]
      const r = await db.query('select id from media where filename = $1', [fn])
      return r.rows.length ? r.rows[0].id : null
    }

    // Bestemmingen: hero en galerij
    for (const d of PLAN.destinations) {
      const row = await db.query('select id from destinations where slug = $1', [d.slug])
      if (!row.rows.length) { console.log('overgeslagen  ' + d.slug); continue }
      const destId = row.rows[0].id
      const heroId = d.hero ? await idVan(d.hero) : null
      const galIds = []
      for (const fn of d.gallery) { const i = await idVan(fn); if (i) galIds.push(i) }
      console.log(d.slug.padEnd(20) + 'hero ' + (d.hero || '-') + '  galerij ' + galIds.length)
      if (dry) continue
      if (heroId) await db.query('update destinations set hero_image_id=$1 where id=$2', [heroId, destId])
      await db.query('delete from destinations_gallery where _parent_id = $1', [destId])
      let o = 0
      for (const i of galIds) {
        o += 1
        await db.query(
          'insert into destinations_gallery (_parent_id, _order, id, image_id) values ($1,$2,gen_random_uuid()::text,$3)',
          [destId, o, i],
        )
      }
    }

    // Blogposts en verhalen: alleen de hero
    for (const [tabel, lijst] of [['posts', PLAN.posts], ['stories', PLAN.stories]]) {
      for (const p of lijst) {
        const row = await db.query('select id from ' + tabel + ' where slug = $1', [p.slug])
        if (!row.rows.length) { console.log('overgeslagen  ' + p.slug); continue }
        const heroId = p.hero ? await idVan(p.hero) : null
        console.log(p.slug.padEnd(36) + (p.hero || '-'))
        if (dry || !heroId) continue
        await db.query('update ' + tabel + ' set hero_image_id=$1 where id=$2', [heroId, row.rows[0].id])
      }
    }

    if (dry) { console.log('\n--dry, er is niets gewijzigd.') }
    else { await db.query('COMMIT'); console.log('\nDoorgevoerd.') }
  } catch (err) {
    if (!dry) await db.query('ROLLBACK').catch(() => {})
    console.error('Mislukt, teruggedraaid:', err.message)
    process.exitCode = 1
  } finally {
    await db.end()
  }
}

main()
