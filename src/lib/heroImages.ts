/**
 * Hero-afbeeldingen van de vaste pagina's, met een blur-placeholder.
 *
 * De placeholder is een 20px-breed jpeg (via sharp) dat meteen in beeld staat
 * terwijl de echte foto laadt. Zonder placeholder toonde de hero seconden
 * lang alleen een groen verloop.
 *
 * Nieuwe hero toevoegen: zet de webp in public/media en genereer de blur met
 *   node -e "import('sharp').then(async ({default: sharp}) => console.log((await sharp('public/media/NAAM.webp').resize(20).jpeg({quality:50}).toBuffer()).toString('base64')))"
 */
export type HeroImage = { src: string; alt: string; blur: string }

const BLUR: Record<string, string> = {
  '/media/DSC_3088-scaled.webp': 'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABQACBP/EACMQAAIABQQCAwAAAAAAAAAAAAECAAMEERIFITFBE2FRUnH/xAAWAQEBAQAAAAAAAAAAAAAAAAADAAT/xAAdEQACAwACAwAAAAAAAAAAAAABAgADEQQTQVGB/9oADAMBAAIRAxEAPwAqVqxKMEsjWsdvgc3jq0vUWdQ83JUyKq4HPomDqCXLqGclFUPLZB6vbeGkopfik01lC5ZEgbnkdn1CV3VU2Er5kaHZAcmtQnZT1t9R2BFClJoCVcnyPUOuJKgAdD9ijQeWwOLmfYPT7n//2Q==',
  '/media/Shirakawago-3.webp': 'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAALABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAIDBAX/xAAiEAABBAEDBQEAAAAAAAAAAAABAAIDERIEMVEhQUJxgdH/xAAVAQEBAAAAAAAAAAAAAAAAAAABA//EABsRAAICAwEAAAAAAAAAAAAAAAECABEDElFB/9oADAMBAAIRAxEAPwCpFp3RuJiyIu+9fiNQySrdYO2yzzPKSAXkiwOvpM+R7Y8muIOO4+pIQ+SK4nqyxkpZN4tBHKE8WolwsusnkAoRonIVk7P/2Q==',
  '/media/langkawi-scaled.webp': 'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQGB//EACMQAAICAgECBwAAAAAAAAAAAAECABEDBAUx0RIiQUJRcrH/xAAWAQEBAQAAAAAAAAAAAAAAAAACAQP/xAAaEQACAwEBAAAAAAAAAAAAAAAAAQISURNB/9oADAMBAAIRAxEAPwBzHzWuzeLG7dfcQP0xscpkcC1Jv4A7zP1yPZ8zAeoBjWDczgriGRqJqySY7LDJqXjLduRCmmZ7+sJJnkNxaUbD0BXQdoSdI4Gs9P/Z',
  '/media/maleisie-5-scaled.webp': 'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANABQDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAMBBAUG/8QAIhAAAQQBBAIDAAAAAAAAAAAAAQIDBBEABRIhMQYiQVGx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAYEQADAQEAAAAAAAAAAAAAAAAAARICEf/aAAwDAQACEQMRAD8AmN5TJZjNodjWBwgptJNfua0fydLrZ3Rn9xHSaIzm4raUhzda+aAUeE5cm6c3H0t527cR7JULHH13kLTGWLna/IdlLWEBI6o2awxemoWuMSXOdx+MMehJ/9k=',
  '/media/maleisie-7-scaled.webp': 'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAANABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAUBAwT/xAAnEAABAwMDAQkAAAAAAAAAAAABAAIEAxESBQYhEyMxQlFSgZGh0f/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAYEQADAQEAAAAAAAAAAAAAAAAAAQIRIf/aAAwDAQACEQMRAD8AnRt2twDZoOV7ZsHHunlXdGn0HYlz3EAHhv6kGnQobGh4jMJHq5W6VSjyh20djja1+4/IQqbQOcKJm7y6uTHYwU7eM2P0hKZOkROscWuA8skI6GH/2Q==',
}

export const HERO_IMAGES = {
  blog: { src: '/media/maleisie-5-scaled.webp', alt: 'Cameron Highlands, Maleisië', blur: BLUR['/media/maleisie-5-scaled.webp'] },
  verhalen: { src: '/media/maleisie-5-scaled.webp', alt: 'Cameron Highlands, Maleisië', blur: BLUR['/media/maleisie-5-scaled.webp'] },
  bestemmingen: { src: '/media/maleisie-7-scaled.webp', alt: 'Maleisië', blur: BLUR['/media/maleisie-7-scaled.webp'] },
  fotografie: { src: '/media/DSC_3088-scaled.webp', alt: 'Reisfotografie', blur: BLUR['/media/DSC_3088-scaled.webp'] },
  kaart: { src: '/media/Shirakawago-3.webp', alt: 'Katsura rivier, Japan', blur: BLUR['/media/Shirakawago-3.webp'] },
  contact: { src: '/media/langkawi-scaled.webp', alt: 'Langkawi, Maleisië', blur: BLUR['/media/langkawi-scaled.webp'] },
} satisfies Record<string, HeroImage>
