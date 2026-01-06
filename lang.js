/*
 * Language switching script for La Maison Brevan.
 *
 * This script provides a simple i18n implementation that swaps out
 * text content based on the user’s selected language.  It defines a
 * set of translation keys and their values for French (fr), English
 * (en), Spanish (es) and German (de).  Elements that should be
 * translated need a data‑i18n attribute whose value is the key to
 * look up in the dictionary.  On page load, the script checks
 * localStorage for a previously selected language; if none is set
 * French is used by default.  The current language flag is shown
 * in the header.  Clicking the flag opens a small menu of other
 * languages; choosing one updates the site and stores the choice.
 */

document.addEventListener('DOMContentLoaded', () => {
  const defaultLang = 'fr';
  const storedLang = localStorage.getItem('lang') || defaultLang;
  // Attempt to locate the legacy dropdown elements.  On pages that use
  // the new always‑visible language selector these elements will be
  // absent (currentLangBtn will be null).  The script gracefully
  // degrades by detecting which markup is present and binding
  // event handlers accordingly.
  const currentLangBtn = document.getElementById('current-lang');
  const langMenu = document.getElementById('lang-menu');
  // Map language codes to flag image paths.  These images live in
  // assets/images/flags and are injected into the buttons via
  // <img> tags in the markup.  When the language changes we
  // update the src attribute on the current language button.
  const flagSrc = {
    fr: 'assets/images/flags/fr.png',
    en: 'assets/images/flags/en.png',
    es: 'assets/images/flags/es.png',
    de: 'assets/images/flags/de.png'
  };
  // Translation dictionary.  Only the most visible UI strings are
  // translated here.  Feel free to expand this object with more keys
  // corresponding to other texts on the site.
  const translations = {
    fr: {
      'nav.reserve': 'réserver',
      'nav.rooms': 'chambres',
      'nav.around': 'autour de la maison',
      'nav.gallery': 'galerie',
      'nav.contact': 'contact',
      'nav.access': 'plan d\'accès',
      'tagline.title': 'Chambres d’hôtes de charme',
      'tagline.subtitle': 'Boutique guesthouse',
      'section.roomsHeading': 'Nos chambres',
      'section.roomsIntro': 'Matériaux naturels, literie haut de gamme, décoration sur mesure. Chaque chambre offre une atmosphère unique.',
      // Correct grammatical gender: "la chambre cheminée" (feminine)
      'room.brevan.name': 'Suite Brévan',
      // Provide translations for the description and detail of the Brévan suite using
      // the content formerly associated with the "chemin" keys.  These keys are
      // referenced by the HTML via data‑i18n attributes (e.g. room.brevan.desc) and
      // therefore must exist in the dictionary.
      'room.brevan.desc': 'Une suite élégante mêlant pierre naturelle et design contemporain. La baignoire intégrée et l’atmosphère feutrée en font un véritable cocon dédié à la détente et au confort.',
      'room.brevan.detail': 'Cette chambre dispose d’une grande cheminée à foyer gaz qui apporte chaleur et convivialité. Les murs en pierres apparentes et les poutres anciennes créent une atmosphère authentique. Une grande douche à l’italienne et un espace de 25 m² offrent tout le confort nécessaire. La literie haut de gamme garantit des nuits paisibles.',
      'room.chemin.desc': 'Une suite élégante mêlant pierre naturelle et design contemporain. La baignoire intégrée et l’atmosphère feutrée en font un véritable cocon dédié à la détente et au confort.',
      'room.aulne.name': 'L’Aulne',
      'room.aulne.desc': 'Douce et lumineuse, L’Aulne séduit par son esprit bohème et ses matières naturelles. Une chambre pleine de charme, propice au lâcher‑prise.',
      'room.aulne.detail': 'Avec sa baignoire indépendante et sa douche à l’italienne, cette chambre est parfaite pour se détendre. Les tons ocres et les matériaux naturels créent une ambiance élégante. Les 25 m² offrent un espace généreux, avec un lit king‑size et un coin salon cosy.',
      'room.baign.desc': 'Douce et lumineuse, L’Aulne séduit par son esprit bohème et ses matières naturelles. Une chambre pleine de charme, propice au lâcher-prise.',
      // Correct plural and gender: "pierres bleues"
      'room.havel.name': 'Havel',
      'room.havel.desc': 'Authentique et équilibrée, Havel reflète l’âme de la maison. Pierre, bois et volumes généreux composent une chambre chaleureuse et intemporelle.',
      'room.havel.detail': 'Cette chambre met à l’honneur les pierres bleues de la région qui habillent ses murs. L’espace de 20 m² est optimisé pour le confort avec un lit king‑size et une grande douche. La décoration mêle bois et textiles naturels pour une ambiance sereine.',
      'room.pierre.desc': 'Authentique et équilibrée, Avel reflète l’âme de la maison. Pierre, bois et volumes généreux composent une chambre chaleureuse et intemporelle.',
      'room.heol.name': 'Heol',
      'room.heol.desc': 'Claire et accueillante, Heol offre une atmosphère simple et élégante. Un refuge lumineux pour un séjour tout en douceur.',
      'room.heol.detail': 'Baignée de lumière, cette chambre de 18 m² offre une atmosphère chaleureuse. Les grandes fenêtres laissent entrer le soleil et donnent sur le jardin. Le mobilier sur mesure et la literie king‑size assurent un séjour agréable.',
      'room.ensoleil.desc': 'Claire et accueillante, Heol offre une atmosphère simple et élégante. Un refuge lumineux pour un séjour tout en douceur.',
      'room.linenn.name': 'Linenn',
      'room.linenn.desc': 'Intimiste et apaisante, Linenn porte bien son nom. Une chambre cosy, idéale pour une halte confortable et reposante.',
      'room.linenn.detail': 'Cette chambre cosy de 16 m² est idéale pour une escapade intimiste. Malgré sa taille, elle offre un lit king‑size, une douche à l’italienne et des rangements ingénieux. La décoration soignée et l’éclairage doux créent un cocon reposant.',
      'room.petite.desc': 'Intimiste et apaisante, Linenn porte bien son nom. Une chambre cosy, idéale pour une halte confortable et reposante.',
      // Footer links
      'footer.legal': 'Mentions légales',
      'footer.cookies': 'Gestion des cookies',
      'footer.cgv': 'CGV'
      ,
      // Newly added key for privacy policy link in footer
      'footer.confidentialite': 'Confidentialité'
      ,
      // Additional translation keys for about and services sections
      'section.espritHeading': 'L’histoire de la maison',
      'section.espritText1': 'En haut de la Grand‑Rue, sur la rive gauche de l’Aulne, au cœur de la jolie petite ville verdoyante de Châteaulin, se trouve une maison toute simple. Elle ressemble à ses voisines : vous passeriez devant sans la remarquer. Et pourtant, Brendan et son frère Gurvan ont eu un véritable coup de cœur pour cette ancêtre châteaulinoise. On dit qu’on y fumait le saumon au début du siècle dernier. Même s’il y avait tout à refaire, ils s’y sont sentis bien immédiatement et, surtout, ils en ont perçu tout son potentiel.',
      'section.espritText2': 'Autodidactes, ils ne sont pas à leur première rénovation, mais ici le chantier est de taille : près de 300 m² et une ampleur de travaux considérable. Ils n’en ont conservé que les murs et le toit. Pourtant, cette vieille dame a gardé toute son âme. Elle a l’élan d’une mère : on s’y sent si bien qu’on n’a plus envie d’en sortir, comme enveloppé dans un cocon.',
      'section.espritText3': 'Gurvan est le bâtisseur, l’artisan, le technicien de tous les corps de métier. Rien ne lui résiste : il trouve toujours des solutions. Il œuvre avec précision et exigence. Brendan, quant à lui, endosse le rôle d’architecte, de décorateur d’intérieur et d’artiste créateur. Il modèle la terre, le bois flotté et les matériaux naturels avec finesse et délicatesse. Leur complémentarité est évidente, renforcée par un solide lien de fraternité.',
      'section.espritText4': 'Ils ont conservé les murs en schiste typiques de la région, récupéré les planchers lorsque cela était possible, recyclé les cloisons de bois du grenier qui habillent aujourd’hui les murs de deux chambres, et mis en valeur les vieilles poutres dans les chambres du premier étage. L’enduit de chaux et de sable appliqué sur les murs apporte une chaleur supplémentaire au lieu.',
      'section.espritText5': 'Brendan privilégie les couleurs chaudes — ocre, sable — ainsi que les matières naturelles, avec une préférence marquée pour le lin, le bois et le rendu du métal rouillé : poignées de placards, garde‑corps… Il a l’exigence de l’artiste.',
      'section.espritText6': 'Gurvan crée également l’ameublement : 90 m² de bois deviennent placards, chevets, encadrements de télévisions et meubles de salles de bains, pendant que son frère ponce et enduit. Tous deux ont le goût du très beau et le talent pour y parvenir. Cela prend du temps : voilà cinq années que le chantier a démarré. D’autres phases de travaux sont encore prévues. Le dernier étage connaîtra quelques modifications et, à l’extérieur, un espace bien‑être verra le jour. Rassurez‑vous, c’est déjà très beau.',
      'section.espritText7': 'Je vous emmène maintenant pour une petite visite. L’entrée est chaleureuse et spacieuse. Mais avant d’aller plus loin, posez votre regard sur ces marches de pierre : ce sont d’anciens linteaux de cheminées, taillés, transportés, transformés. Rien ne les arrête. Le plafond, couleur ocre, et les lumières chaudes renforcent l’atmosphère enveloppante. L’escalier, fait maison évidemment, apporte sa touche de chêne et de métal rouillé. Même la buanderie mérite qu’on s’y attarde.',
      'section.espritText8': 'Pour les chambres, la visite se fera en photos : vous ressentirez immédiatement la chaleur du lieu. On a juste envie de s’y blottir.',
      'section.espritText9': 'La maison Brevan est avant tout une invitation à ralentir, à se poser, à ressentir.',
      'section.checkHeading': 'Check In/Out',
      'section.checkLine1': 'Les chambres doivent être libérées à 10h.',
      'section.checkLine2': 'Arrivée à partir de 16h00 jusqu\'à 20h30.',
      'section.checkLine3': 'Si vous devez arriver plus tard, prévenez-nous ; nous organiserons votre arrivée en fonction.',
      'section.servicesHeading': 'Services',
      'section.services.item1': 'Jardin avec piscine',
      'section.services.item2': 'Espace bien‑être : sauna, douche extérieure, massages sur demande',
      'section.services.item3': 'En soirée : dégustations de vins et snackings',
      'section.services.item4': 'Accueil des cyclistes : buanderie, abri fermé (avec possibilité de charger les batteries), station de nettoyage, panier pic‑nic sur demande',
      'section.services.item5': 'Un lieu pour travailler différemment : Séminaires et indépendants',
      'section.notaHeading': 'Nota Bene',
      'section.nota.item1': 'Enfants de moins de 12 ans non acceptés (pour des raisons de sécurité)',
      'section.nota.item2': 'Nos amis les animaux ne sont pas acceptés… car le jeune lévrier Maxim réside avec nous',
      'section.nota.item3': 'Pour permettre à nos hôtes de profiter de la sérénité voulue pour les lieux, les chambres n’ont pas de télévisions installées',
      'footer.followTitle': 'Nous suivre',
      'footer.planAccess': 'Plan d\'accès',
      // Legal page titles
      'mentions.title': 'Mentions légales',
      'privacy.title': 'Politique de confidentialité',
      'cookies.title': 'Gestion des cookies',
      'cgv.title': 'Conditions générales de vente'
      ,
      // Price tags for each room (à partir de ... / nuit)
      'price.brevan': 'à partir de 115€ / nuit',
      'price.aulne': 'à partir de 105€ / nuit',
      'price.havel': 'à partir de 105€ / nuit',
      'price.heol': 'à partir de 95€ / nuit',
      'price.linenn': 'à partir de 95€ / nuit',
      // Amenities
      'amenity.shower': 'Grande douche italienne',
      'amenity.fire': 'Cheminée',
      'amenity.bath': 'Baignoire',
      'amenity.wifi': 'Wifi gratuit',
      'amenity.nosmoking': 'Non fumeur',
      'amenity.bed': 'Lit King‑size',
      'amenity.tv': 'Télévision',
      // Buttons
      'button.details': 'Plus de détails',
      'button.reserve': 'Réserver'
      ,
      // Service and Nota Bene translations (French)
      'services.access.heading': 'Accès à la cour',
      'services.access.desc': 'Un accès direct à la cour intérieure, propice à la détente et à des instants de calme en toute discrétion.',
      'services.cyclists.heading': 'Accueil des cyclistes',
      'services.cyclists.desc': 'Les cyclistes sont chaleureusement accueillis. Un espace sécurisé et dédié est prévu pour le stationnement des vélos, avec possibilité de recharge des batteries ainsi qu’un point de nettoyage à disposition.',
      'services.breakfast.heading': 'Petit‑déjeuner',
      'services.breakfast.desc': 'Un service de petit‑déjeuner sur réservation est proposé, mettant à l’honneur une sélection soignée de produits locaux, choisis pour leur qualité et leur authenticité.',
      'nota.animals.heading': 'Animaux',
      'nota.animals.desc': 'Afin de préserver le confort, l’harmonie et la quiétude des lieux, les animaux ne sont pas admis au sein de l’établissement.',
      'nota.serenite.heading': 'Sérénité & respect du calme',
      'nota.serenite.desc': 'Pour permettre à nos hôtes de profiter de la sérénité voulue pour les lieux, nous vous remercions de respecter le calme entre 22 h et 7 h du matin.',
      // Renamed room Avel (formerly Havel)
      'room.avel.name': 'Avel',
      'room.avel.desc': 'Authentique et équilibrée, Avel reflète l’âme de la maison. Pierre, bois et volumes généreux composent une chambre chaleureuse et intemporelle.',
      'room.avel.detail': 'Cette chambre met à l’honneur les pierres bleues de la région qui habillent ses murs. L’espace de 20 m² est optimisé pour le confort avec un lit king‑size et une grande douche. La décoration mêle bois et textiles naturels pour une ambiance sereine.',
      'room.avel.features': 'Lit king‑size (2 clients) • 20 m²',
      'price.avel': 'à partir de 105€ / nuit',
      // Feature lines for each room: bed size and surface area
      'room.chemin.features': 'Lit king‑size (2 clients) • 25 m²',
      'room.baign.features': 'Lit king‑size (2 clients) • 25 m²',
      'room.pierre.features': 'Lit king‑size (2 clients) • 20 m²',
      'room.ensoleil.features': 'Lit king‑size (2 clients) • 18 m²',
      'room.petite.features': 'Lit king‑size (2 clients) • 16 m²',
      // Detailed descriptions for each room used in the overlay. These provide
      // additional information beyond the brief description and features lines.
      'room.chemin.detail': 'Cette chambre dispose d’une grande cheminée à foyer gaz qui apporte chaleur et convivialité. Les murs en pierres apparentes et les poutres anciennes créent une atmosphère authentique. Une grande douche à l’italienne et un espace de 25 m² offrent tout le confort nécessaire. La literie haut de gamme garantit des nuits paisibles.',
      'room.baign.detail': 'Avec sa baignoire indépendante et sa douche à l’italienne, cette chambre est parfaite pour se détendre. Les tons ocres et les matériaux naturels créent une ambiance élégante. Les 25 m² offrent un espace généreux, avec un lit king‑size et un coin salon cosy.',
      'room.pierre.detail': 'Cette chambre met à l’honneur les pierres bleues de la région qui habillent ses murs. L’espace de 20 m² est optimisé pour le confort avec un lit king‑size et une grande douche. La décoration mêle bois et textiles naturels pour une ambiance sereine.',
      'room.ensoleil.detail': 'Baignée de lumière, cette chambre de 18 m² offre une atmosphère chaleureuse. Les grandes fenêtres laissent entrer le soleil et donnent sur le jardin. Le mobilier sur mesure et la literie king‑size assurent un séjour agréable.',
      'room.petite.detail': 'Cette chambre cosy de 16 m² est idéale pour une escapade intimiste. Malgré sa taille, elle offre un lit king‑size, une douche à l’italienne et des rangements ingénieux. La décoration soignée et l’éclairage doux créent un cocon reposant.',
      'around.title': 'Autour de la Maison Brévan',
      'around.intro.p1': 'Située au cœur de Châteaulin, La Maison Brévan bénéficie d’un emplacement privilégié, entre vallées verdoyantes, littoral sauvage et villages de caractère.',
      'around.intro.p2': 'Ici, tout invite à la découverte du Finistère dans ce qu’il a de plus authentique, sans jamais renoncer au calme et à la douceur de vivre.',
      'around.intro.p3': 'Depuis la maison, les plus beaux paysages bretons se rejoignent facilement, le temps d’une excursion à la journée ou d’une simple escapade improvisée.',
      'around.nature.title': 'Nature & grands espaces',
      'around.nature.p1': 'À quelques minutes seulement, la vallée de l’Aulne et le canal de Nantes à Brest offrent un cadre paisible pour les promenades à pied ou à vélo. Les chemins bordés d’eau, la lumière changeante et la végétation généreuse composent un décor propice au ralentissement et à la contemplation.',
      'around.nature.p2': 'Un peu plus loin, le Menez‑Hom, sommet emblématique du Finistère, dévoile l’un des plus beaux panoramas de la région. Depuis ses hauteurs, le regard embrasse la baie de Douarnenez, les Monts d’Arrée et l’arrière‑pays breton. Un lieu idéal pour les amateurs de randonnée et de grands horizons.',
      'around.beaches.title': 'Plages & littoral',
      'around.beaches.p1': 'La Maison Brévan se situe à une distance idéale du littoral, permettant de rejoindre facilement de vastes plages tout en conservant la tranquillité de l’intérieur des terres.',
      'around.beaches.p2': 'La plage de Pentrez, dans la baie de Douarnenez, séduit par son étendue de sable fin et son ambiance familiale, particulièrement appréciée en fin de journée lorsque la lumière se fait plus douce.',
      'around.beaches.p3': 'Plus sauvage, Sainte‑Anne‑la‑Palud déploie une immense baie ouverte sur l’océan, superbe à marée basse et très appréciée pour les longues marches face à l’Atlantique.',
      'around.beaches.p4': 'La presqu’île de Crozon, enfin, offre une succession de criques, de falaises et de plages aux reflets turquoise. Morgat, Camaret‑sur‑Mer ou encore les pointes rocheuses alentour figurent parmi les paysages les plus spectaculaires de Bretagne.',
      'around.villages.title': 'Villages & patrimoine',
      'around.villages.p1': 'À une courte distance en voiture, Locronan, classé parmi les plus beaux villages de France, charme par ses ruelles pavées, ses maisons de granit et son atmosphère hors du temps.',
      'around.villages.p2': 'Douarnenez, ancienne cité sardinière, mêle aujourd’hui port animé, plages urbaines et esprit maritime. Une halte idéale pour flâner le long des quais ou découvrir la culture locale.',
      'around.villages.p3': 'La presqu’île de Crozon et ses villages – Argol, Landévennec, Camaret – constituent un territoire à part, entre patrimoine religieux, ports typiques et paysages sauvages.',
      'around.villages.p4': 'Plus au sud, la Pointe du Raz, grand site naturel, offre une expérience saisissante face aux éléments, là où la terre s’avance dans l’océan.',
      'around.access.title': 'Accès & facilité de déplacement',
      'around.access.p1': 'La Maison Brévan est facilement accessible et constitue une base idéale pour rayonner dans tout le Finistère.',
      'around.access.p2': 'La gare de Châteaulin, située à quelques minutes, permet de rejoindre Quimper ou Brest.',
      'around.access.p3': 'Les aéroports de Brest Bretagne et Quimper Bretagne desservent la région selon les saisons et facilitent les arrivées depuis la France et l’Europe.',
      'around.conclusion.title': 'Une invitation à explorer la Bretagne autrement',
      'around.conclusion.p1': 'Séjourner à La Maison Brévan, c’est choisir un lieu central et apaisant, à la croisée des chemins entre mer, nature et patrimoine.',
      'around.conclusion.p2': 'Une adresse pensée pour celles et ceux qui souhaitent découvrir la Bretagne avec élégance, liberté et sérénité',
},
    en: {
      'nav.reserve': 'book',
      'nav.rooms': 'rooms',
      'nav.around': 'around the house',
      'nav.gallery': 'gallery',
      'nav.contact': 'contact',
      'nav.access': 'access map',
      'tagline.title': 'Boutique guesthouse',
      'tagline.subtitle': 'Boutique guesthouse',
      'section.roomsHeading': 'Our rooms',
      'section.roomsIntro': 'Natural materials, premium bedding, bespoke décor. Each room offers a unique atmosphere.',
      'room.chemin.name': 'Mineral Suite',
      'room.chemin.desc': 'An elegant suite blending natural stone and contemporary design. The integrated bathtub and cosy ambience make it a true cocoon dedicated to relaxation and comfort.',
      'room.baign.name': 'Aulne',
      'room.baign.desc': 'Soft and luminous, the Aulne charms with its bohemian spirit and natural materials. A room full of character, conducive to letting go.',
      'room.havel.name': 'Havel',
      'room.pierre.desc': 'Authentic and balanced, Avel reflects the soul of the house. Stone, wood and generous volumes compose a warm and timeless room.',
      // Corrected room name for Heol suite
      'room.ensoleil.name': 'Heol',
      'room.ensoleil.desc': 'Bright and welcoming, Heol offers a simple and elegant atmosphere. A luminous refuge for a gentle stay.',
      // Corrected room name for the Linenn room
      'room.petite.name': 'Linenn',
      'room.petite.desc': 'Intimate and soothing, Linenn lives up to its name. A cosy room, ideal for a comfortable and restful stop.',
      'footer.legal': 'Legal notice',
      'footer.cookies': 'Cookie policy',
      'footer.cgv': 'Terms & conditions'
      ,
      'footer.confidentialite': 'Privacy'
      ,
      // Additional translation keys for about and services sections
      'section.espritHeading': 'The history of the house',
      'section.espritText1': 'At the top of the Grand‑Rue on the left bank of the Aulne, in the heart of the pretty, green town of Châteaulin, there is a very simple house. It looks like its neighbours: you would pass by without noticing it. And yet, Brendan and his brother Gurvan fell head over heels for this old Châteaulin house. It is said that salmon was smoked there at the beginning of the last century. Even though everything had to be redone, they felt at home immediately and, above all, saw its full potential.',
      'section.espritText2': 'Self‑taught, they are not on their first renovation, but this project is significant: nearly 300 m² and considerable work. They kept only the walls and the roof. Yet this old lady has kept all her soul. It has the impetus of a mother: you feel so good there that you no longer want to leave, as if wrapped in a cocoon.',
      'section.espritText3': 'Gurvan is the builder, the craftsman, the technician of all trades. Nothing resists him: he always finds solutions. He works with precision and high standards. Brendan, meanwhile, takes on the role of architect, interior decorator and artistic creator. He shapes clay, driftwood and natural materials with finesse and delicacy. Their complementarity is obvious, reinforced by a strong brotherly bond.',
      'section.espritText4': 'They kept the shale walls typical of the region, recovered the floors when possible, recycled the wooden partitions from the attic which now dress the walls of two rooms, and showcased the old beams in the bedrooms on the first floor. The lime and sand plaster applied to the walls adds extra warmth to the place.',
      'section.espritText5': 'Brendan favours warm colours — ochre, sand — as well as natural materials, with a marked preference for linen, wood and the look of rusted metal: wardrobe handles, railings… He has the demands of an artist.',
      'section.espritText6': 'Gurvan also creates the furnishings: 90 m² of wood become cupboards, bedside tables, television frames and bathroom furniture, while his brother sands and plasters. Both have a taste for beauty and the talent to achieve it. It takes time: five years now that the work has started. Other phases of work are still planned. The top floor will undergo some modifications and, outside, a wellness area will see the light of day. Don’t worry, it’s already very beautiful.',
      'section.espritText7': 'Now I take you on a little tour. The entrance is warm and spacious. But before going any further, look at these stone steps: they are former fireplace lintels, cut, transported, transformed. Nothing stops them. The ochre‑coloured ceiling and warm lights reinforce the enveloping atmosphere. The staircase, obviously home‑made, brings its touch of oak and rusted metal. Even the laundry room is worth a visit.',
      'section.espritText8': 'For the bedrooms, the visit will be done in photos: you will immediately feel the warmth of the place. You just want to curl up in it.',
      'section.espritText9': 'La Maison Brevan is above all an invitation to slow down, to settle down, to feel.',
      'section.checkHeading': 'Check In/Out',
      'section.checkLine1': 'Rooms must be vacated at 10:00 am.',
      'section.checkLine2': 'Arrival from 4:00 pm to 8:30 pm.',
      'section.checkLine3': 'If you need to arrive later, let us know; we will arrange your arrival accordingly.',
      'section.servicesHeading': 'Services',
      'section.services.item1': 'Garden with pool',
      'section.services.item2': 'Wellness area: sauna, outdoor shower, massages on request',
      'section.services.item3': 'In the evening: wine tastings and snacks',
      'section.services.item4': 'Cyclists welcome: laundry, secure shelter (with charging facilities), cleaning station, picnic basket on request',
      'section.services.item5': 'A place to work differently: seminars and freelancers',
      'section.notaHeading': 'Nota Bene',
      'section.nota.item1': 'Children under 12 not accepted (for safety reasons)',
      'section.nota.item2': 'We do not accept pets... because our young greyhound Maxim lives with us',
      'section.nota.item3': 'To allow our guests to enjoy the desired serenity of the place, the rooms are not equipped with televisions',
      'footer.followTitle': 'Follow us',
      'footer.planAccess': 'Find us',
      // Legal page titles
      'mentions.title': 'Legal notice',
      'privacy.title': 'Privacy policy',
      'cookies.title': 'Cookie management',
      'cgv.title': 'Terms and conditions'
      ,
      // Price tags for each room (from ... / night)
      'price.brevan': 'from €110 / night',
      'price.aulne': 'from €100 / night',
      'price.havel': 'from €100 / night',
      'price.heol': 'from €90 / night',
      'price.linenn': 'from €90 / night',
      // Amenities
      'amenity.shower': 'Italian shower',
      'amenity.fire': 'Fireplace',
      'amenity.bath': 'Bathtub',
      'amenity.wifi': 'Free wifi',
      'amenity.nosmoking': 'Non smoking',
      'amenity.bed': 'King-size bed',
      'amenity.tv': 'Television',
      // Buttons
      'button.details': 'More details',
      'button.reserve': 'Book'
      ,
      // Service and Nota Bene translations (English)
      'services.access.heading': 'Courtyard access',
      'services.access.desc': 'Direct access to the inner courtyard offers a relaxing space for discreet moments of calm.',
      'services.cyclists.heading': 'Cyclist welcome',
      'services.cyclists.desc': 'Cyclists are warmly welcomed. A secure area is provided for bicycle parking, with battery charging facilities and a cleaning station.',
      'services.breakfast.heading': 'Breakfast',
      'services.breakfast.desc': 'Breakfast service is available on request, featuring a carefully curated selection of local products chosen for their quality and authenticity.',
      'nota.animals.heading': 'Pets',
      'nota.animals.desc': 'To preserve the comfort, harmony and tranquillity of the premises, pets are not allowed.',
      'nota.serenite.heading': 'Serenity & quiet',
      'nota.serenite.desc': 'To allow our guests to enjoy the desired serenity of the place, please respect the quiet between 10 pm and 7 am.',
      // Renamed room Avel (formerly Havel)
      'room.avel.name': 'Avel',
      'room.avel.desc': 'Authentic and balanced, Avel reflects the soul of the house. Stone, wood and generous volumes compose a warm and timeless room.',
      'room.avel.detail': 'This room celebrates the region’s blue stones adorning its walls. The 20 m² space is optimised for comfort with a king-size bed and a large shower. The décor blends wood and natural textiles for a serene ambience.',
      'room.avel.features': 'King-size bed (2 guests) • 20 m²',
      'price.avel': 'from €100 / night',
      // Feature lines for each room: bed size and surface area
      'room.chemin.features': 'King-size bed (2 guests) • 25 m²',
      'room.baign.features': 'King-size bed (2 guests) • 25 m²',
      'room.pierre.features': 'King-size bed (2 guests) • 20 m²',
      'room.ensoleil.features': 'King-size bed (2 guests) • 18 m²',
      'room.petite.features': 'King-size bed (2 guests) • 16 m²',
      // Detailed descriptions for each room used in the overlay.
      'room.chemin.detail': 'This room boasts a large gas fireplace that adds warmth and conviviality. Exposed stone walls and old beams create an authentic atmosphere. A spacious Italian shower and a generous 25 m² area offer every comfort. High-end bedding guarantees peaceful nights.',
      'room.baign.detail': 'With its free-standing bathtub and Italian shower, this room is perfect for unwinding. Ochre tones and natural materials create an elegant ambience. The 25 m² space offers a king-size bed and a cosy sitting area.',
      'room.pierre.detail': 'This room celebrates the region’s blue stones adorning its walls. The 20 m² space is optimised for comfort with a king-size bed and a large shower. The décor blends wood and natural textiles for a serene ambience.',
      'room.ensoleil.detail': 'Bathed in light, this 18 m² room offers a warm atmosphere. Large windows let in the sun and overlook the garden. Custom furniture and king-size bedding ensure a pleasant stay.',
      'room.petite.detail': 'This cosy 16 m² room is ideal for an intimate getaway. Despite its size, it offers a king-size bed, an Italian shower and clever storage. The carefully chosen décor and soft lighting create a restful cocoon.',
      // Added translations for the renamed rooms (Brévan, Aulne, Havel, Heol, Linenn)
      'room.brevan.name': 'Brévan Suite',
      'room.brevan.desc': 'An elegant suite blending natural stone and contemporary design. The integrated bathtub and cosy ambience make it a true cocoon dedicated to relaxation and comfort.',
      'room.brevan.detail': 'This room boasts a large gas fireplace that adds warmth and conviviality. Exposed stone walls and old beams create an authentic atmosphere. A spacious Italian shower and a generous 25 m² area offer every comfort. High-end bedding guarantees peaceful nights.',
      'room.brevan.features': 'King-size bed (2 guests) • 25 m²',
      'room.aulne.name': 'Aulne',
      'room.aulne.desc': 'Soft and luminous, the Canopy charms with its bohemian spirit and natural materials. A room full of character, conducive to letting go.',
      'room.aulne.detail': 'With its free-standing bathtub and Italian shower, this room is perfect for unwinding. Ochre tones and natural materials create an elegant ambience. The 25 m² space offers a king-size bed and a cosy sitting area.',
      'room.aulne.features': 'King-size bed (2 guests) • 25 m²',
      'room.havel.name': 'Havel',
      'room.havel.desc': 'Authentic and balanced, Havel reflects the soul of the house. Stone, wood and generous volumes compose a warm and timeless room.',
      'room.havel.detail': 'This room celebrates the region’s blue stones adorning its walls. The 20 m² space is optimised for comfort with a king-size bed and a large shower. The décor blends wood and natural textiles for a serene ambience.',
      'room.havel.features': 'King-size bed (2 guests) • 20 m²',
      'room.heol.name': 'Heol',
      'room.heol.desc': 'Bright and welcoming, Heol offers a simple and elegant atmosphere. A luminous refuge for a gentle stay.',
      'room.heol.detail': 'Bathed in light, this 18 m² room offers a warm atmosphere. Large windows let in the sun and overlook the garden. Custom furniture and king-size bedding ensure a pleasant stay.',
      'room.heol.features': 'King-size bed (2 guests) • 18 m²',
      'room.linenn.name': 'Linenn',
      'room.linenn.desc': 'Intimate and soothing, Linenn lives up to its name. A cosy room, ideal for a comfortable and restful stop.',
      'room.linenn.detail': 'This cosy 16 m² room is ideal for an intimate getaway. Despite its size, it offers a king-size bed, an Italian shower and clever storage. The carefully chosen décor and soft lighting create a restful cocoon.',
      'room.linenn.features': 'King-size bed (2 guests) • 16 m²',
          'around.title': 'Around La Maison Brévan',
      'around.intro.p1': 'Located in the heart of Châteaulin, La Maison Brévan enjoys a privileged setting between verdant valleys, wild coastline and characterful villages.',
      'around.intro.p2': 'Here, everything invites you to discover Finistère at its most authentic, without ever giving up tranquillity and the gentle way of life.',
      'around.intro.p3': 'From the house, the most beautiful Breton landscapes are within easy reach, whether for a day trip or an impromptu getaway.',
      'around.nature.title': 'Nature and wide open spaces',
      'around.nature.p1': 'Just a few minutes away, the Aulne Valley and the Nantes–Brest canal offer a peaceful setting for walking or cycling. Water‑lined paths, changing light and lush vegetation create a backdrop conducive to slowing down and contemplation.',
      'around.nature.p2': 'A little further on, the Menez‑Hom, an emblematic summit of Finistère, reveals one of the most beautiful panoramas in the region. From its heights, the view encompasses the Bay of Douarnenez, the Monts d’Arrée and the Breton hinterland. An ideal spot for lovers of hiking and wide horizons.',
      'around.beaches.title': 'Beaches and coastline',
      'around.beaches.p1': 'La Maison Brévan is ideally located from the coast, allowing you to reach wide beaches easily while retaining the tranquillity of the interior.',
      'around.beaches.p2': 'Pentrez beach, in the Bay of Douarnenez, appeals for its expanse of fine sand and family atmosphere, particularly appreciated at the end of the day when the light softens.',
      'around.beaches.p3': 'Wilder, Sainte‑Anne‑la‑Palud unfurls a vast bay open to the ocean, superb at low tide and much loved for long walks facing the Atlantic.',
      'around.beaches.p4': 'Finally, the Crozon peninsula offers a succession of coves, cliffs and turquoise‑tinged beaches. Morgat, Camaret‑sur‑Mer and the nearby rocky points are among the most spectacular landscapes in Brittany.',
      'around.villages.title': 'Villages and heritage',
      'around.villages.p1': 'A short drive away, Locronan, listed as one of the most beautiful villages in France, charms with its cobbled streets, granite houses and timeless atmosphere.',
      'around.villages.p2': 'Douarnenez, a former sardine‑fishing town, today combines a lively port, urban beaches and a maritime spirit. An ideal stop to stroll along the quays or discover local culture.',
      'around.villages.p3': 'The Crozon peninsula and its villages – Argol, Landévennec, Camaret – form a separate territory, between religious heritage, typical ports and wild landscapes.',
      'around.villages.p4': 'Further south, Pointe du Raz, a major natural site, offers a breathtaking experience in the face of the elements, where the land juts into the ocean.',
      'around.access.title': 'Access and ease of travel',
      'around.access.p1': 'La Maison Brévan is easily accessible and is an ideal base for exploring the whole of Finistère.',
      'around.access.p2': 'Châteaulin station, just a few minutes away, links to Quimper or Brest.',
      'around.access.p3': 'Brest Bretagne and Quimper Bretagne airports serve the region seasonally and make arrivals from France and Europe easier.',
      'around.conclusion.title': 'An invitation to explore Brittany differently',
      'around.conclusion.p1': 'Staying at La Maison Brévan means choosing a central, peaceful place at the crossroads of the sea, nature and heritage.',
      'around.conclusion.p2': 'An address designed for those who wish to discover Brittany with elegance, freedom and serenity.',
},
    es: {
      'nav.reserve': 'reservar',
      'nav.rooms': 'habitaciones',
      'nav.around': 'alrededor de la casa',
      'nav.gallery': 'galería',
      'nav.contact': 'contacto',
      'nav.access': 'plano de acceso',
      'tagline.title': 'Casa de huéspedes con encanto',
      'tagline.subtitle': 'Casa de huéspedes boutique',
      'section.roomsHeading': 'Nuestras habitaciones',
      'section.roomsIntro': 'Materiales naturales, ropa de cama de alta calidad, decoración a medida. Cada habitación ofrece un ambiente único.',
      // Updated room names and descriptions to match the new concept
      'room.chemin.name': 'Suite Minérale',
      'room.chemin.desc': 'Una suite elegante que combina piedra natural y diseño contemporáneo. La bañera integrada y el ambiente tenue la convierten en un auténtico capullo dedicado al descanso y al confort.',
      'room.baign.name': 'L’Aulne',
      'room.baign.desc': 'Dulce y luminosa, L’Aulne seduce por su espíritu bohemio y sus materiales naturales. Una habitación llena de encanto, propicia para dejarse llevar.',
      'room.pierre.name': 'Avel',
      'room.pierre.desc': 'Auténtica y equilibrada, Avel refleja el alma de la casa. Piedra, madera y volúmenes generosos componen una habitación cálida e intemporal.',
      'room.ensoleil.name': 'Heol',
      'room.ensoleil.desc': 'Clara y acogedora, Heol ofrece una atmósfera sencilla y elegante. Un refugio luminoso para una estancia suave.',
      // Corrected room name for the Linenn room in Spanish
      'room.petite.name': 'Linenn',
      'room.petite.desc': 'Íntima y calmante, Linenn hace honor a su nombre. Una habitación acogedora, ideal para una parada cómoda y reparadora.',
      'footer.legal': 'Aviso legal',
      'footer.cookies': 'Gestión de cookies',
      'footer.cgv': 'Condiciones generales'
      ,
      'footer.confidentialite': 'Privacidad'
      ,
      // Additional translation keys for about and services sections
      'section.espritHeading': 'La historia de la casa',
      'section.espritText1': 'En lo alto de la Grand‑Rue, en la ribera izquierda del Aulne, en el corazón de la bonita y verde ciudad de Châteaulin, se encuentra una casa muy sencilla. Se parece a sus vecinas : pasarías delante sin notarla. Y sin embargo, Brendan y su hermano Gurvan se enamoraron de esta antigua casa châteaulinoise. Se dice que aquí se ahumaba el salmón a principios del siglo pasado. Aunque había que rehacerlo todo, se sintieron bien inmediatamente y, sobre todo, percibieron todo su potencial.',
      'section.espritText2': 'Autodidactas, no es su primera renovación, pero esta obra es de gran envergadura : casi 300 m² y un volumen considerable de trabajos. Sólo conservaron las paredes y el tejado. Sin embargo, esta vieja dama ha conservado toda su alma. Tiene el impulso de una madre : uno se siente tan bien que ya no quiere salir, como envuelto en un capullo.',
      'section.espritText3': 'Gurvan es el constructor, el artesano, el técnico de todos los oficios. Nada se le resiste : siempre encuentra soluciones. Trabaja con precisión y exigencia. Brendan, por su parte, asume el papel de arquitecto, decorador de interiores y creador artístico. Modela la arcilla, la madera flotante y los materiales naturales con finura y delicadeza. Su complementariedad es evidente, reforzada por un sólido vínculo fraternal.',
      'section.espritText4': 'Han conservado los muros de pizarra típicos de la región, recuperado los suelos cuando era posible, reciclado los tabiques de madera del desván que ahora visten las paredes de dos habitaciones y realzado las viejas vigas en las habitaciones del primer piso. El enlucido de cal y arena aplicado en las paredes aporta un calor adicional al lugar.',
      'section.espritText5': 'Brendan privilegia los colores cálidos — ocre, arena — así como los materiales naturales, con una marcada preferencia por el lino, la madera y el aspecto del metal oxidado : tiradores de armarios, barandillas… Tiene la exigencia del artista.',
      'section.espritText6': 'Gurvan también crea el mobiliario : 90 m² de madera se convierten en armarios, mesillas de noche, marcos de televisión y muebles de baño, mientras su hermano lija y enyesa. Ambos tienen el gusto por lo muy bello y el talento para lograrlo. Lleva tiempo : cinco años que la obra ha comenzado. Aún se prevén otras fases de trabajos. El último piso tendrá algunas modificaciones y, en el exterior, verá la luz un espacio de bienestar. Tranquilos, ya es muy bonito.',
      'section.espritText7': 'Ahora te llevo de visita. La entrada es cálida y espaciosa. Pero antes de ir más lejos, posa tu mirada en estos escalones de piedra : son antiguos dinteles de chimeneas, tallados, transportados, transformados. Nada los detiene. El techo, de color ocre, y las luces cálidas refuerzan la atmósfera envolvente. La escalera, hecha en casa evidentemente, aporta su toque de roble y metal oxidado. Incluso la lavandería merece que nos detengamos.',
      'section.espritText8': 'Para las habitaciones, la visita será fotográfica : sentirás inmediatamente el calor del lugar. Solo tienes ganas de acurrucarte allí.',
      'section.espritText9': 'La Maison Brevan es ante todo una invitación a ralentizar, a posarse, a sentir.',
      'section.checkHeading': 'Check In/Out',
      'section.checkLine1': 'Las habitaciones deben quedar libres a las 10:00 h.',
      'section.checkLine2': 'Llegada de 16:00 a 20:30.',
      'section.checkLine3': 'Si necesita llegar más tarde, avísenos; organizaremos su llegada en consecuencia.',
      'section.servicesHeading': 'Servicios',
      'section.services.item1': 'Jardín con piscina',
      'section.services.item2': 'Zona de bienestar: sauna, ducha exterior, masajes bajo petición',
      'section.services.item3': 'Por la tarde: catas de vino y picoteo',
      'section.services.item4': 'Ciclistas bienvenidos: lavandería, refugio cerrado (con posibilidad de cargar baterías), estación de limpieza, cesta de picnic bajo petición',
      'section.services.item5': 'Un lugar para trabajar de otra manera: seminarios e independientes',
      'section.notaHeading': 'Nota Bene',
      'section.nota.item1': 'No se aceptan niños menores de 12 años (por razones de seguridad)',
      'section.nota.item2': 'No se aceptan mascotas… porque vive con nosotros un joven lebrel llamado Maxim',
      'section.nota.item3': 'Para que nuestros huéspedes disfruten de la serenidad deseada del lugar, las habitaciones no disponen de televisores',
      'footer.followTitle': 'Síguenos',
      'footer.planAccess': 'Cómo llegar',
      // Legal page titles
      'mentions.title': 'Aviso legal',
      'privacy.title': 'Política de privacidad',
      'cookies.title': 'Gestión de cookies',
      'cgv.title': 'Condiciones generales de venta',
      // Around page content (Spanish translation)
      'around.title': 'Alrededor de la Maison Brévan',
      'around.intro.p1': 'Situada en el corazón de Châteaulin, La Maison Brévan goza de una ubicación privilegiada, entre valles verdes, litoral salvaje y pueblos con carácter.',
      'around.intro.p2': 'Aquí, todo invita a descubrir Finisterre en su versión más auténtica, sin renunciar nunca a la calma y la dulzura de vivir.',
      'around.intro.p3': 'Desde la casa, los paisajes bretones más hermosos se alcanzan fácilmente, ya sea para una excursión de un día o una escapada improvisada.',
      'around.nature.title': 'Naturaleza y grandes espacios',
      'around.nature.p1': 'A pocos minutos, el valle del Aulne y el canal de Nantes a Brest ofrecen un entorno tranquilo para paseos a pie o en bicicleta. Los caminos bordeados de agua, la luz cambiante y la vegetación generosa componen un decorado propicio para desacelerar y contemplar.',
      'around.nature.p2': 'Un poco más lejos, el Menez‑Hom, cima emblemática del Finisterre, revela una de las panorámicas más bellas de la región. Desde sus alturas se divisa la bahía de Douarnenez, los Montes de Arrée y el interior de Bretaña. Un lugar ideal para los amantes del senderismo y los grandes horizontes.',
      'around.beaches.title': 'Playas y litoral',
      'around.beaches.p1': 'La Maison Brévan se encuentra a una distancia ideal del litoral, permitiendo llegar fácilmente a extensas playas mientras se conserva la tranquilidad del interior.',
      'around.beaches.p2': 'La playa de Pentrez, en la bahía de Douarnenez, seduce por su extensión de arena fina y su ambiente familiar, especialmente apreciada al final del día cuando la luz se suaviza.',
      'around.beaches.p3': 'Más salvaje, Sainte‑Anne‑la‑Palud despliega una inmensa bahía abierta al océano, magnífica en marea baja y muy apreciada para largos paseos frente al Atlántico.',
      'around.beaches.p4': 'La península de Crozon ofrece una sucesión de calas, acantilados y playas con reflejos turquesas. Morgat, Camaret‑sur‑Mer y los cabos rocosos de los alrededores figuran entre los paisajes más espectaculares de Bretaña.',
      'around.villages.title': 'Pueblos y patrimonio',
      'around.villages.p1': 'A poca distancia en coche, Locronan, clasificado entre los pueblos más bonitos de Francia, encanta por sus calles empedradas, sus casas de granito y su atmósfera fuera del tiempo.',
      'around.villages.p2': 'Douarnenez, antigua ciudad sardina, mezcla hoy un puerto animado, playas urbanas y espíritu marítimo. Una parada ideal para pasear por los muelles o descubrir la cultura local.',
      'around.villages.p3': 'La península de Crozon y sus pueblos — Argol, Landévennec, Camaret — constituyen un territorio a parte, entre patrimonio religioso, puertos típicos y paisajes salvajes.',
      'around.villages.p4': 'Más al sur, la Pointe du Raz, un gran sitio natural, ofrece una experiencia impresionante frente a los elementos, donde la tierra se adentra en el océano.',
      'around.access.title': 'Acceso y facilidad de desplazamiento',
      'around.access.p1': 'La Maison Brévan es fácilmente accesible y constituye una base ideal para recorrer todo Finisterre.',
      'around.access.p2': 'La estación de Châteaulin, situada a pocos minutos, permite llegar a Quimper o Brest.',
      'around.access.p3': 'Los aeropuertos de Brest Bretagne y Quimper Bretagne sirven a la región según las temporadas y facilitan las llegadas desde Francia y Europa.',
      'around.conclusion.title': 'Una invitación a explorar Bretaña de otra manera',
      'around.conclusion.p1': 'Alojarse en La Maison Brévan es elegir un lugar central y apacible, en la encrucijada entre mar, naturaleza y patrimonio.',
      'around.conclusion.p2': 'Una dirección pensada para quienes desean descubrir Bretaña con elegancia, libertad y serenidad',
      // Price tags for each room (desde ... / noche)
      'price.chemin': 'desde 110€ / noche',
      'price.baign': 'desde 100€ / noche',
      'price.pierre': 'desde 95€ / noche',
      'price.ensoleil': 'desde 90€ / noche',
      'price.petite': 'desde 85€ / noche',
      // Amenities
      'amenity.shower': 'Ducha italiana',
      'amenity.fire': 'Chimenea',
      'amenity.bath': 'Bañera',
      'amenity.wifi': 'Wifi gratuito',
      'amenity.nosmoking': 'No fumadores',
      'amenity.bed': 'Cama King-size',
      'amenity.tv': 'Televisión',
      // Buttons
      'button.details': 'Más detalles',
      'button.reserve': 'Reservar'
      ,
      // Service and Nota Bene translations (Spanish)
      'services.access.heading': 'Acceso al patio',
      'services.access.desc': 'Acceso directo al patio interior, propicio para relajarse y disfrutar de momentos de calma con total discreción.',
      'services.cyclists.heading': 'Acogida de ciclistas',
      'services.cyclists.desc': 'Los ciclistas son cordialmente recibidos. Se dispone de un espacio seguro y dedicado para aparcar las bicicletas, con posibilidad de recargar las baterías y un punto de limpieza.',
      'services.breakfast.heading': 'Desayuno',
      'services.breakfast.desc': 'Se ofrece servicio de desayuno con reserva previa, destacando una cuidada selección de productos locales elegidos por su calidad y autenticidad.',
      'nota.animals.heading': 'Animales',
      'nota.animals.desc': 'Para preservar la comodidad, la armonía y la tranquilidad del lugar, no se admiten animales.',
      'nota.serenite.heading': 'Serenidad y respeto al silencio',
      'nota.serenite.desc': 'Para permitir que nuestros huéspedes disfruten de la serenidad del lugar, le agradecemos que respete la tranquilidad entre las 22:00 y las 7:00.',
      // Renamed room Avel (formerly Havel)
      'room.avel.name': 'Avel',
      'room.avel.desc': 'Auténtica y equilibrada, Avel refleja el alma de la casa. Piedra, madera y generosos volúmenes componen una habitación cálida e intemporal.',
      'room.avel.detail': 'Esta habitación rinde homenaje a las piedras azules de la región que visten sus muros. El espacio de 20 m² está optimizado para el confort con una cama king‑size y una gran ducha. La decoración mezcla madera y tejidos naturales para un ambiente sereno.',
      'room.avel.features': 'Cama king‑size (2 huéspedes) • 20 m²',
      'price.avel': 'desde 100€ / noche',
      // Feature lines for each room: bed size and surface area
      'room.chemin.features': 'Cama king‑size (2 huéspedes) • 25 m²',
      'room.baign.features': 'Cama king‑size (2 huéspedes) • 25 m²',
      'room.pierre.features': 'Cama king‑size (2 huéspedes) • 20 m²',
      'room.ensoleil.features': 'Cama king‑size (2 huéspedes) • 18 m²',
      'room.petite.features': 'Cama king‑size (2 huéspedes) • 16 m²',
      // Descripciones detalladas para cada habitación utilizadas en la vista emergente.
      'room.chemin.detail': 'Esta habitación dispone de una gran chimenea de gas que aporta calidez y convivialidad. Los muros de piedra vista y las vigas antiguas crean un ambiente auténtico. Una gran ducha italiana y un espacio de 25 m² ofrecen todo el confort necesario. La ropa de cama de gama alta garantiza noches apacibles.',
      'room.baign.detail': 'Con su bañera independiente y su ducha italiana, esta habitación es perfecta para relajarse. Los tonos ocres y los materiales naturales crean un ambiente elegante. Los 25 m² ofrecen un espacio generoso, con cama king-size y un rincón de salón acogedor.',
      'room.pierre.detail': 'Esta habitación rinde homenaje a las piedras azules de la región que visten sus muros. El espacio de 20 m² está optimizado para el confort con una cama king‑size y una gran ducha. La decoración mezcla madera y tejidos naturales para un ambiente sereno.',
      'room.ensoleil.detail': 'Bañada de luz, esta habitación de 18 m² ofrece una atmósfera cálida. Las grandes ventanas dejan entrar el sol y dan al jardín. El mobiliario a medida y la cama king‑size aseguran una estancia agradable.',
      'room.petite.detail': 'Esta acogedora habitación de 16 m² es ideal para una escapada íntima. A pesar de su tamaño, ofrece una cama king‑size, una ducha italiana y soluciones de almacenamiento ingeniosas. La decoración cuidadosa y la iluminación suave crean un capullo reposante.',
      // Added translations for the renamed rooms (Brévan, Aulne, Havel, Heol, Linenn)
      'room.brevan.name': 'Suite Brévan',
      'room.brevan.desc': 'Una suite elegante que combina piedra natural y diseño contemporáneo. La bañera integrada y el ambiente tenue la convierten en un auténtico capullo dedicado al descanso y al confort.',
      'room.brevan.detail': 'Esta habitación dispone de una gran chimenea de gas que aporta calidez y convivialidad. Los muros de piedra vista y las vigas antiguas crean un ambiente auténtico. Una gran ducha italiana y una superficie generosa de 25 m² ofrecen todo el confort necesario. La ropa de cama de alta gama garantiza noches apacibles.',
      'room.brevan.features': 'Cama king‑size (2 huéspedes) • 25 m²',
      'room.aulne.name': 'L’Aulne',
      'room.aulne.desc': 'Dulce y luminosa, L’Aulne seduce por su espíritu bohemio y sus materiales naturales. Una habitación llena de encanto, propicia para dejarse llevar.',
      'room.aulne.detail': 'Con su bañera independiente y su ducha italiana, esta habitación es perfecta para relajarse. Los tonos ocres y los materiales naturales crean un ambiente elegante. Los 25 m² ofrecen un espacio generoso, con una cama king‑size y un rincón de salón acogedor.',
      'room.aulne.features': 'Cama king‑size (2 huéspedes) • 25 m²',
      'room.havel.name': 'Havel',
      'room.havel.desc': 'Auténtica y equilibrada, Havel refleja el alma de la casa. Piedra, madera y generosos volúmenes componen una habitación cálida e intemporal.',
      'room.havel.detail': 'Esta habitación rinde homenaje a las piedras azules de la región que visten sus muros. El espacio de 20 m² está optimizado para el confort con una cama king‑size y una gran ducha. La decoración mezcla madera y tejidos naturales para un ambiente sereno.',
      'room.havel.features': 'Cama king‑size (2 huéspedes) • 20 m²',
      'room.heol.name': 'Heol',
      'room.heol.desc': 'Clara y acogedora, Heol ofrece una atmósfera sencilla y elegante. Un refugio luminoso para una estancia suave.',
      'room.heol.detail': 'Bañada de luz, esta habitación de 18 m² ofrece una atmósfera cálida. Las grandes ventanas dejan entrar el sol y dan al jardín. El mobiliario a medida y la cama king‑size aseguran una estancia agradable.',
      'room.heol.features': 'Cama king‑size (2 huéspedes) • 18 m²',
      'room.linenn.name': 'Linenn',
      'room.linenn.desc': 'Íntima y calmante, Linenn hace honor a su nombre. Una habitación acogedora, ideal para una parada cómoda y reparadora.',
      'room.linenn.detail': 'Esta acogedora habitación de 16 m² es ideal para una escapada íntima. A pesar de su tamaño, ofrece una cama king‑size, una ducha italiana y soluciones de almacenamiento ingeniosas. La decoración cuidadosa y la iluminación suave crean un capullo reposante.',
      'room.linenn.features': 'Cama king‑size (2 huéspedes) • 16 m²',
      // Price tags for the renamed rooms (desde ... / noche)
      'price.brevan': 'desde 115€ / noche',
      'price.aulne': 'desde 105€ / noche',
      'price.havel': 'desde 105€ / noche',
      'price.heol': 'desde 95€ / noche',
      'price.linenn': 'desde 95€ / noche',
      // Around page content (Spanish translation)
      'around.title': 'Alrededor de la Maison Brévan',
      'around.intro.p1': 'Situada en el corazón de Châteaulin, La Maison Brévan goza de una ubicación privilegiada, entre valles verdes, litoral salvaje y pueblos con carácter.',
      'around.intro.p2': 'Aquí, todo invita a descubrir Finisterre en su versión más auténtica, sin renunciar nunca a la calma y la dulzura de vivir.',
      'around.intro.p3': 'Desde la casa, los paisajes bretones más hermosos se alcanzan fácilmente, ya sea para una excursión de un día o una escapada improvisada.',
      'around.nature.title': 'Naturaleza y grandes espacios',
      'around.nature.p1': 'A pocos minutos, el valle del Aulne y el canal de Nantes a Brest ofrecen un entorno tranquilo para paseos a pie o en bicicleta. Los caminos bordeados de agua, la luz cambiante y la vegetación generosa componen un decorado propicio para desacelerar y contemplar.',
      'around.nature.p2': 'Un poco más lejos, el Menez‑Hom, cima emblemática del Finisterre, revela una de las panorámicas más bellas de la región. Desde sus alturas se divisa la bahía de Douarnenez, los Montes de Arrée y el interior de Bretaña. Un lugar ideal para los amantes del senderismo y los grandes horizontes.',
      'around.beaches.title': 'Playas y litoral',
      'around.beaches.p1': 'La Maison Brévan se encuentra a una distancia ideal del litoral, permitiendo llegar fácilmente a extensas playas mientras se conserva la tranquilidad del interior.',
      'around.beaches.p2': 'La playa de Pentrez, en la bahía de Douarnenez, seduce por su extensión de arena fina y su ambiente familiar, especialmente apreciada al final del día cuando la luz se suaviza.',
      'around.beaches.p3': 'Más salvaje, Sainte‑Anne‑la‑Palud despliega una inmensa bahía abierta al océano, magnífica en marea baja y muy apreciada para largos paseos frente al Atlántico.',
      'around.beaches.p4': 'La península de Crozon ofrece una sucesión de calas, acantilados y playas con reflejos turquesas. Morgat, Camaret‑sur‑Mer y los cabos rocosos de los alrededores figuran entre los paisajes más espectaculares de Bretaña.',
      'around.villages.title': 'Pueblos y patrimonio',
      'around.villages.p1': 'A poca distancia en coche, Locronan, clasificado entre los pueblos más bonitos de Francia, encanta por sus calles empedradas, sus casas de granito y su atmósfera fuera del tiempo.',
      'around.villages.p2': 'Douarnenez, antigua ciudad sardinera, mezcla hoy un puerto animado, playas urbanas y espíritu marítimo. Una parada ideal para pasear por los muelles o descubrir la cultura local.',
      'around.villages.p3': 'La península de Crozon y sus pueblos — Argol, Landévennec, Camaret — constituyen un territorio a parte, entre patrimonio religioso, puertos típicos y paisajes salvajes.',
      'around.villages.p4': 'Más al sur, la Pointe du Raz, un gran sitio natural, ofrece una experiencia impresionante frente a los elementos, donde la tierra se adentra en el océano.',
      'around.access.title': 'Acceso y facilidad de desplazamiento',
      'around.access.p1': 'La Maison Brévan es fácilmente accesible y constituye una base ideal para recorrer todo Finisterre.',
      'around.access.p2': 'La estación de Châteaulin, situada a pocos minutos, permite llegar a Quimper o Brest.',
      'around.access.p3': 'Los aeropuertos de Brest Bretagne y Quimper Bretagne sirven a la región según las temporadas y facilitan las llegadas desde Francia y Europa.',
      'around.conclusion.title': 'Una invitación a explorar Bretaña de otra manera',
      'around.conclusion.p1': 'Alojarse en La Maison Brévan es elegir un lugar central y apacible, en la encrucijada entre mar, naturaleza y patrimonio.',
      'around.conclusion.p2': 'Una dirección pensada para quienes desean descubrir Bretaña con elegancia, libertad y serenidad.',
},
    de: {
      'nav.reserve': 'buchen',
      'nav.rooms': 'zimmer',
      'nav.around': 'rund um das haus',
      'nav.gallery': 'galerie',
      'nav.contact': 'kontakt',
      'nav.access': 'anfahrt',
      'tagline.title': 'Charmantes Gästehaus',
      'tagline.subtitle': 'Boutique-Gästehaus',
      'section.roomsHeading': 'Unsere Zimmer',
      'section.roomsIntro': 'Naturmaterialien, hochwertige Bettwäsche, maßgeschneiderte Dekoration. Jedes Zimmer bietet eine einzigartige Atmosphäre.',
      // Updated room names and descriptions (keep French names for authenticity)
      'room.chemin.name': 'Suite Minérale',
      'room.chemin.desc': 'Eine elegante Suite, die Naturstein und modernes Design vereint. Die integrierte Badewanne und die gedämpfte Atmosphäre machen sie zu einem echten Kokon, der der Entspannung und dem Komfort gewidmet ist.',
      'room.baign.name': 'L’Aulne',
      'room.baign.desc': 'Sanft und lichtdurchflutet verzaubert L’Aulne durch seinen Bohème‑Geist und natürliche Materialien. Ein charmantes Zimmer, das zum Loslassen einlädt.',
      'room.pierre.name': 'Avel',
      'room.pierre.desc': 'Authentisch und ausgewogen spiegelt Avel die Seele des Hauses wider. Stein, Holz und großzügige Volumen bilden ein warmes und zeitloses Zimmer.',
      'room.ensoleil.name': 'Heol',
      'room.ensoleil.desc': 'Hell und einladend bietet Heol eine einfache und elegante Atmosphäre. Ein lichtdurchflutetes Refugium für einen sanften Aufenthalt.',
      // Corrected room name for the Linenn room in German
      'room.petite.name': 'Linenn',
      'room.petite.desc': 'Intim und beruhigend – Linenn macht seinem Namen alle Ehre. Ein gemütliches Zimmer, ideal für eine komfortable und erholsame Pause.',
      'footer.legal': 'Impressum',
      'footer.cookies': 'Cookie-Richtlinie',
      'footer.cgv': 'AGB'
      ,
      'footer.confidentialite': 'Datenschutz'
      ,
      // Additional translation keys for about and services sections
      'section.espritHeading': 'Die Geschichte des Hauses',
      'section.espritText1': 'Oben in der Grand‑Rue, am linken Ufer der Aulne, im Herzen der hübschen grünen Stadt Châteaulin, steht ein ganz einfaches Haus. Es sieht aus wie seine Nachbarn : Man würde daran vorbeigehen, ohne es zu bemerken. Und doch haben Brendan und sein Bruder Gurvan sich in dieses alte Haus in Châteaulin verliebt. Man sagt, dass hier zu Beginn des letzten Jahrhunderts Lachs geräuchert wurde. Obwohl alles neu gemacht werden musste, fühlten sie sich sofort wohl und erkannten vor allem sein ganzes Potenzial.',
      'section.espritText2': 'Als Autodidakten ist es nicht ihre erste Renovierung, aber dieses Bauvorhaben ist groß : fast 300 m² und ein beträchtliches Ausmaß an Arbeiten. Sie haben nur die Wände und das Dach erhalten. Dennoch hat diese alte Dame ihre ganze Seele bewahrt. Sie hat den Schwung einer Mutter : Man fühlt sich so wohl, dass man gar nicht mehr hinausgehen möchte, wie eingehüllt in einen Kokon.',
      'section.espritText3': 'Gurvan ist der Baumeister, der Handwerker, der Techniker für alle Gewerke. Nichts widersteht ihm : Er findet immer Lösungen. Er arbeitet präzise und anspruchsvoll. Brendan hingegen übernimmt die Rolle des Architekten, Innenarchitekten und künstlerischen Gestalters. Er modelliert Ton, Treibholz und natürliche Materialien mit Feinsinn und Zartheit. Ihre Komplementarität ist offensichtlich, verstärkt durch ein starkes brüderliches Band.',
      'section.espritText4': 'Sie haben die für die Region typischen Schiefermauern erhalten, die Böden, wann immer es möglich war, wiedergewonnen, die hölzernen Dachbodentrennwände recycelt, die heute die Wände von zwei Zimmern verkleiden, und die alten Balken in den Schlafzimmern im ersten Stock in Wert gesetzt. Der aus Kalk und Sand aufgetragene Putz verleiht dem Ort zusätzliche Wärme.',
      'section.espritText5': 'Brendan bevorzugt warme Farben – Ocker, Sand – sowie natürliche Materialien, mit einer ausgeprägten Vorliebe für Leinen, Holz und die Optik von rostigem Metall : Schrankgriffe, Geländer… Er hat den Anspruch eines Künstlers.',
      'section.espritText6': 'Gurvan schafft außerdem die Möblierung : 90 m² Holz werden zu Schränken, Nachttischen, TV‑Rahmen und Badmöbeln, während sein Bruder schleift und verputzt. Beide haben einen Sinn für das Schöne und das Talent, es zu erreichen. Das dauert : fünf Jahre sind vergangen, seit der Bau begonnen hat. Weitere Bauphasen sind noch geplant. Das oberste Stockwerk wird einige Veränderungen erfahren und draußen wird ein Wellnessbereich entstehen. Keine Sorge, es ist schon sehr schön.',
      'section.espritText7': 'Ich nehme Sie jetzt mit auf einen kleinen Rundgang. Der Eingang ist warm und geräumig. Aber bevor wir weitergehen, richten Sie Ihren Blick auf diese Steinstufen : Es sind ehemalige Kaminstürze, geschnitten, transportiert, transformiert. Nichts hält sie auf. Die ockerfarbene Decke und das warme Licht verstärken die umhüllende Atmosphäre. Die Treppe, natürlich hausgemacht, bringt ihre Note aus Eiche und rostigem Metall. Selbst die Waschküche ist einen Besuch wert.',
      'section.espritText8': 'Für die Zimmer wird die Besichtigung in Fotos erfolgen : Sie werden sofort die Wärme des Ortes spüren. Man möchte sich einfach hinein kuscheln.',
      'section.espritText9': 'La Maison Brevan ist vor allem eine Einladung, langsamer zu werden, zur Ruhe zu kommen, zu fühlen.',
      'section.checkHeading': 'An-/Abreise',
      'section.checkLine1': 'Die Zimmer müssen um 10:00 Uhr geräumt werden.',
      'section.checkLine2': 'Anreise von 16:00 bis 20:30 Uhr.',
      'section.checkLine3': 'Wenn Sie später anreisen müssen, teilen Sie uns dies bitte mit; wir werden Ihre Ankunft entsprechend organisieren.',
      'section.servicesHeading': 'Dienstleistungen',
      'section.services.item1': 'Garten mit Pool',
      'section.services.item2': 'Wellnessbereich: Sauna, Außendusche, Massagen auf Anfrage',
      'section.services.item3': 'Am Abend: Weinproben und Snacks',
      'section.services.item4': 'Radfahrer willkommen: Wäscherei, abschließbarer Unterstand (mit Lademöglichkeit), Waschstation, Picknickkorb auf Anfrage',
      'section.services.item5': 'Ein Ort, um anders zu arbeiten: Seminare und Freiberufler',
      'section.notaHeading': 'Hinweis',
      'section.nota.item1': 'Kinder unter 12 Jahren nicht akzeptiert (aus Sicherheitsgründen)',
      'section.nota.item2': 'Haustiere sind nicht erlaubt... denn unser junger Windhund Maxim wohnt bei uns',
      'section.nota.item3': 'Damit unsere Gäste die gewünschte Ruhe des Ortes genießen können, sind die Zimmer nicht mit Fernsehern ausgestattet.',
      'footer.followTitle': 'Folgen Sie uns',
      'footer.planAccess': 'Anfahrt',
      // Legal page titles
      'mentions.title': 'Impressum',
      'privacy.title': 'Datenschutzerklärung',
      'cookies.title': 'Cookie‑Verwaltung',
      'cgv.title': 'Allgemeine Geschäftsbedingungen',
      // Around page content (German translation)
      'around.title': 'Rund um die Maison Brévan',
      'around.intro.p1': 'Im Herzen von Châteaulin gelegen, genießt La Maison Brévan eine privilegierte Lage zwischen grünen Tälern, wilder Küste und charaktervollen Dörfern.',
      'around.intro.p2': 'Hier lädt alles dazu ein, das Finistère von seiner authentischsten Seite zu entdecken, ohne je auf Ruhe und Lebensfreude zu verzichten.',
      'around.intro.p3': 'Vom Haus aus sind die schönsten bretonischen Landschaften leicht erreichbar – sei es für einen Tagesausflug oder einen spontanen Abstecher.',
      'around.nature.title': 'Natur und weite Landschaften',
      'around.nature.p1': 'Nur wenige Minuten entfernt bieten das Aulne‑Tal und der Nantes‑Brest‑Kanal einen friedlichen Rahmen für Spaziergänge zu Fuß oder mit dem Fahrrad. Die von Wasser gesäumten Wege, das wechselnde Licht und die üppige Vegetation bilden eine Kulisse, die zum Entschleunigen und zur Kontemplation einlädt.',
      'around.nature.p2': 'Etwas weiter entfernt enthüllt der Menez‑Hom, ein symbolischer Gipfel des Finistère, eines der schönsten Panoramen der Region. Von seiner Höhe aus überblickt man die Bucht von Douarnenez, die Monts d’Arrée und das bretonische Hinterland. Ein idealer Ort für Wanderfreunde und Liebhaber weiter Horizonte.',
      'around.beaches.title': 'Strände und Küste',
      'around.beaches.p1': 'La Maison Brévan liegt in idealer Entfernung zur Küste, sodass man leicht weitläufige Strände erreicht, ohne die Ruhe des Hinterlandes zu verlieren.',
      'around.beaches.p2': 'Der Strand von Pentrez in der Bucht von Douarnenez begeistert durch seinen ausgedehnten feinen Sand und seine familiäre Atmosphäre, die besonders am Ende des Tages geschätzt wird, wenn das Licht sanfter wird.',
      'around.beaches.p3': 'Wilder ist Sainte‑Anne‑la‑Palud: eine riesige Bucht, die sich zum Ozean öffnet, bei Ebbe herrlich und sehr beliebt für lange Spaziergänge entlang des Atlantiks.',
      'around.beaches.p4': 'Schließlich bietet die Halbinsel Crozon eine Abfolge von Buchten, Klippen und Stränden mit türkisfarbenen Reflexen. Morgat, Camaret‑sur‑Mer und die umliegenden Felsvorsprünge gehören zu den spektakulärsten Landschaften der Bretagne.',
      'around.villages.title': 'Dörfer und Kulturerbe',
      'around.villages.p1': 'Nur eine kurze Autofahrt entfernt verzaubert Locronan, eines der schönsten Dörfer Frankreichs, mit seinen gepflasterten Gassen, seinen Granithäusern und seiner zeitlosen Atmosphäre.',
      'around.villages.p2': 'Douarnenez, eine ehemalige Sardinenstadt, vereint heute einen belebten Hafen, Stadtstrände und maritimes Flair. Ein idealer Zwischenstopp, um entlang der Kais zu schlendern oder die lokale Kultur zu entdecken.',
      'around.villages.p3': 'Die Halbinsel Crozon und ihre Dörfer – Argol, Landévennec, Camaret – bilden ein Gebiet für sich, zwischen religiösem Erbe, typischen Häfen und wilden Landschaften.',
      'around.villages.p4': 'Weiter südlich bietet die Pointe du Raz, eine bedeutende Naturstätte, ein eindrucksvolles Erlebnis angesichts der Elemente, dort, wo das Land in den Ozean vordringt.',
      'around.access.title': 'Anreise & Mobilität',
      'around.access.p1': 'La Maison Brévan ist leicht zugänglich und stellt eine ideale Basis dar, um das gesamte Finistère zu erkunden.',
      'around.access.p2': 'Der Bahnhof von Châteaulin, nur wenige Minuten entfernt, ermöglicht es, Quimper oder Brest zu erreichen.',
      'around.access.p3': 'Die Flughäfen Brest Bretagne und Quimper Bretagne bedienen die Region je nach Saison und erleichtern Anreisen aus Frankreich und Europa.',
      'around.conclusion.title': 'Eine Einladung, die Bretagne anders zu entdecken',
      'around.conclusion.p1': 'Ein Aufenthalt in La Maison Brévan bedeutet, einen zentralen und ruhigen Ort an der Kreuzung zwischen Meer, Natur und Kulturerbe zu wählen.',
      'around.conclusion.p2': 'Eine Adresse für jene, die die Bretagne mit Eleganz, Freiheit und Gelassenheit entdecken möchten',
      // Price tags for each room (ab ... / Nacht)
      'price.chemin': 'ab 110€ / Nacht',
      'price.baign': 'ab 100€ / Nacht',
      'price.pierre': 'ab 95€ / Nacht',
      'price.ensoleil': 'ab 90€ / Nacht',
      'price.petite': 'ab 85€ / Nacht',
      // Amenities
      'amenity.shower': 'Italienische Dusche',
      'amenity.fire': 'Kamin',
      'amenity.bath': 'Badewanne',
      'amenity.wifi': 'Kostenloses WLAN',
      'amenity.nosmoking': 'Nichtraucher',
      'amenity.bed': 'Kingsize‑Bett',
      'amenity.tv': 'Fernseher',
      // Buttons
      'button.details': 'Mehr Details',
      'button.reserve': 'Buchen'
      ,
      // Service and Nota Bene translations (German)
      'services.access.heading': 'Zugang zum Innenhof',
      'services.access.desc': 'Direkter Zugang zum Innenhof, der sich ideal zum Entspannen und für diskrete Momente der Ruhe eignet.',
      'services.cyclists.heading': 'Empfang für Radfahrer',
      'services.cyclists.desc': 'Radfahrer sind herzlich willkommen. Es gibt einen sicheren und speziellen Bereich zum Abstellen der Fahrräder sowie Lademöglichkeiten für Akkus und eine Reinigungsstation.',
      'services.breakfast.heading': 'Frühstück',
      'services.breakfast.desc': 'Ein Frühstücksservice ist auf Reservierung erhältlich, mit einer sorgfältigen Auswahl lokaler Produkte, die für ihre Qualität und Authentizität ausgewählt wurden.',
      'nota.animals.heading': 'Tiere',
      'nota.animals.desc': 'Um Komfort, Harmonie und Ruhe zu bewahren, sind Tiere nicht erlaubt.',
      'nota.serenite.heading': 'Gelassenheit & Ruhe',
      'nota.serenite.desc': 'Um unseren Gästen die gewünschte Ruhe zu ermöglichen, bitten wir Sie, die Ruhe zwischen 22 Uhr und 7 Uhr zu respektieren.',
      // Renamed room Avel (formerly Havel)
      'room.avel.name': 'Avel',
      'room.avel.desc': 'Authentisch und ausgewogen spiegelt Avel die Seele des Hauses wider. Stein, Holz und großzügige Volumen bilden ein warmes und zeitloses Zimmer.',
      'room.avel.detail': 'Dieses Zimmer stellt die blauen Steine der Region in den Mittelpunkt, die seine Wände schmücken. Der 20 m² große Raum ist für den Komfort optimiert mit einem Kingsize‑Bett und einer großen Dusche. Die Dekoration verbindet Holz und natürliche Stoffe für eine ruhige Atmosphäre.',
      'room.avel.features': 'Kingsize‑Bett (2 Gäste) • 20 m²',
      'price.avel': 'ab 105€ / Nacht',
      // Feature lines for each room: bed size and surface area
      'room.chemin.features': 'Kingsize‑Bett (2 Gäste) • 25 m²',
      'room.baign.features': 'Kingsize‑Bett (2 Gäste) • 25 m²',
      'room.pierre.features': 'Kingsize‑Bett (2 Gäste) • 20 m²',
      'room.ensoleil.features': 'Kingsize‑Bett (2 Gäste) • 18 m²',
      'room.petite.features': 'Kingsize‑Bett (2 Gäste) • 16 m²',
      // Ausführliche Beschreibungen der einzelnen Zimmer für das Overlay.
      'room.chemin.detail': 'Dieses Zimmer verfügt über einen großen Gaskamin, der Wärme und Geselligkeit verleiht. Sichtbare Steinwände und alte Balken schaffen eine authentische Atmosphäre. Eine großzügige italienische Dusche und eine Fläche von 25 m² bieten allen Komfort. Hochwertige Bettwäsche garantiert ruhige Nächte.',
      'room.baign.detail': 'Mit seiner freistehenden Badewanne und der italienischen Dusche ist dieses Zimmer perfekt zum Entspannen. Ockertöne und natürliche Materialien schaffen ein elegantes Ambiente. Die 25 m² bieten ein großzügiges Raumangebot mit einem Kingsize‑Bett und einer gemütlichen Sitzecke.',
      'room.pierre.detail': 'Dieses Zimmer stellt die blauen Steine der Region in den Mittelpunkt, die seine Wände schmücken. Der 20 m² große Raum ist für den Komfort optimiert mit einem Kingsize‑Bett und einer großen Dusche. Die Dekoration verbindet Holz und natürliche Stoffe für eine ruhige Atmosphäre.',
      'room.ensoleil.detail': 'Dieses von Licht durchflutete 18 m² große Zimmer bietet eine warme Atmosphäre. Große Fenster lassen die Sonne herein und blicken auf den Garten. Maßgefertigte Möbel und ein Kingsize‑Bett sorgen für einen angenehmen Aufenthalt.',
      'room.petite.detail': 'Dieses gemütliche 16 m² große Zimmer ist ideal für einen intimen Kurzurlaub. Trotz seiner Größe bietet es ein Kingsize‑Bett, eine italienische Dusche und clevere Stauraumlösungen. Die sorgfältige Dekoration und die sanfte Beleuchtung schaffen einen erholsamen Kokon.',
      // Added translations for the renamed rooms (Brévan, Aulne, Havel, Heol, Linenn)
      'room.brevan.name': 'Suite Brévan',
      'room.brevan.desc': 'Eine elegante Suite, die Naturstein und modernes Design vereint. Die integrierte Badewanne und die gedämpfte Atmosphäre machen sie zu einem echten Kokon, der der Entspannung und dem Komfort gewidmet ist.',
      'room.brevan.detail': 'Dieses Zimmer verfügt über einen großen Gaskamin, der Wärme und Geselligkeit verleiht. Sichtbare Steinwände und alte Balken schaffen eine authentische Atmosphäre. Eine großzügige italienische Dusche und eine Fläche von 25 m² bieten allen Komfort. Hochwertige Bettwäsche garantiert ruhige Nächte.',
      'room.brevan.features': 'Kingsize‑Bett (2 Gäste) • 25 m²',
      'room.aulne.name': 'L’Aulne',
      'room.aulne.desc': 'Sanft und lichtdurchflutet verzaubert L’Aulne durch seinen Bohème‑Geist und natürliche Materialien. Ein charmantes Zimmer, das zum Loslassen einlädt.',
      'room.aulne.detail': 'Mit seiner freistehenden Badewanne und der italienischen Dusche ist dieses Zimmer perfekt zum Entspannen. Ockertöne und natürliche Materialien schaffen ein elegantes Ambiente. Die 25 m² bieten ein großzügiges Raumangebot mit einem Kingsize‑Bett und einer gemütlichen Sitzecke.',
      'room.aulne.features': 'Kingsize‑Bett (2 Gäste) • 25 m²',
      'room.havel.name': 'Havel',
      'room.havel.desc': 'Authentisch und ausgewogen spiegelt Havel die Seele des Hauses wider. Stein, Holz und großzügige Volumen bilden ein warmes und zeitloses Zimmer.',
      'room.havel.detail': 'Dieses Zimmer stellt die blauen Steine der Region in den Mittelpunkt, die seine Wände schmücken. Der 20 m² große Raum ist für den Komfort optimiert mit einem Kingsize‑Bett und einer großen Dusche. Die Dekoration verbindet Holz und natürliche Stoffe für eine ruhige Atmosphäre.',
      'room.havel.features': 'Kingsize‑Bett (2 Gäste) • 20 m²',
      'room.heol.name': 'Heol',
      'room.heol.desc': 'Hell und einladend bietet Heol eine einfache und elegante Atmosphäre. Ein lichtdurchflutetes Refugium für einen sanften Aufenthalt.',
      'room.heol.detail': 'Dieses von Licht durchflutete 18 m² große Zimmer bietet eine warme Atmosphäre. Große Fenster lassen die Sonne herein und blicken auf den Garten. Maßgefertigte Möbel und ein Kingsize‑Bett sorgen für einen angenehmen Aufenthalt.',
      'room.heol.features': 'Kingsize‑Bett (2 Gäste) • 18 m²',
      'room.linenn.name': 'Linenn',
      'room.linenn.desc': 'Intim und beruhigend – Linenn macht seinem Namen alle Ehre. Ein gemütliches Zimmer, ideal für eine komfortable und erholsame Pause.',
      'room.linenn.detail': 'Dieses gemütliche 16 m² große Zimmer ist ideal für einen intimen Kurzurlaub. Trotz seiner Größe bietet es ein Kingsize‑Bett, eine italienische Dusche und clevere Stauraumlösungen. Die sorgfältige Dekoration und die sanfte Beleuchtung schaffen einen erholsamen Kokon.',
      'room.linenn.features': 'Kingsize‑Bett (2 Gäste) • 16 m²',
      // Price tags for the renamed rooms (ab ... / Nacht)
      'price.brevan': 'ab 115€ / Nacht',
      'price.aulne': 'ab 105€ / Nacht',
      'price.havel': 'ab 105€ / Nacht',
      'price.heol': 'ab 95€ / Nacht',
      'price.linenn': 'ab 95€ / Nacht',
      // Around page content (German translation)
      'around.title': 'Rund um die Maison Brévan',
      'around.intro.p1': 'Im Herzen von Châteaulin gelegen, genießt La Maison Brévan eine privilegierte Lage zwischen grünen Tälern, wilder Küste und charaktervollen Dörfern.',
      'around.intro.p2': 'Hier lädt alles dazu ein, das Finistère von seiner authentischsten Seite zu entdecken, ohne je auf Ruhe und Lebensfreude zu verzichten.',
      'around.intro.p3': 'Vom Haus aus sind die schönsten bretonischen Landschaften leicht erreichbar – sei es für einen Tagesausflug oder einen spontanen Abstecher.',
      'around.nature.title': 'Natur und weite Landschaften',
      'around.nature.p1': 'Nur wenige Minuten entfernt bieten das Aulne‑Tal und der Nantes‑Brest‑Kanal einen friedlichen Rahmen für Spaziergänge zu Fuß oder mit dem Fahrrad. Die von Wasser gesäumten Wege, das wechselnde Licht und die üppige Vegetation bilden eine Kulisse, die zum Entschleunigen und zur Kontemplation einlädt.',
      'around.nature.p2': 'Etwas weiter entfernt enthüllt der Menez‑Hom, ein symbolischer Gipfel des Finistère, eines der schönsten Panoramen der Region. Von seiner Höhe aus überblickt man die Bucht von Douarnenez, die Monts d’Arrée und das bretonische Hinterland. Ein idealer Ort für Wanderfreunde und Liebhaber weiter Horizonte.',
      'around.beaches.title': 'Strände und Küste',
      'around.beaches.p1': 'La Maison Brévan liegt in idealer Entfernung zur Küste, sodass man leicht weitläufige Strände erreicht, ohne die Ruhe des Hinterlandes zu verlieren.',
      'around.beaches.p2': 'Der Strand von Pentrez in der Bucht von Douarnenez begeistert durch seinen ausgedehnten feinen Sand und seine familiäre Atmosphäre, die besonders am Ende des Tages geschätzt wird, wenn das Licht sanfter wird.',
      'around.beaches.p3': 'Wilder ist Sainte‑Anne‑la‑Palud: eine riesige Bucht, die sich zum Ozean öffnet, bei Ebbe herrlich und sehr beliebt für lange Spaziergänge entlang des Atlantiks.',
      'around.beaches.p4': 'Schließlich bietet die Halbinsel Crozon eine Abfolge von Buchten, Klippen und Stränden mit türkisfarbenen Reflexen. Morgat, Camaret‑sur‑Mer und die umliegenden Felsvorsprünge gehören zu den spektakulärsten Landschaften der Bretagne.',
      'around.villages.title': 'Dörfer und Kulturerbe',
      'around.villages.p1': 'Nur eine kurze Autofahrt entfernt verzaubert Locronan, eines der schönsten Dörfer Frankreichs, mit seinen gepflasterten Gassen, seinen Granithäusern und seiner zeitlosen Atmosphäre.',
      'around.villages.p2': 'Douarnenez, eine ehemalige Sardinenstadt, vereint heute einen belebten Hafen, Stadtstrände und maritimes Flair. Ein idealer Zwischenstopp, um entlang der Kais zu schlendern oder die lokale Kultur zu entdecken.',
      'around.villages.p3': 'Die Halbinsel Crozon und ihre Dörfer – Argol, Landévennec, Camaret – bilden ein Gebiet für sich, zwischen religiösem Erbe, typischen Häfen und wilden Landschaften.',
      'around.villages.p4': 'Weiter südlich bietet die Pointe du Raz, eine bedeutende Naturstätte, ein eindrucksvolles Erlebnis angesichts der Elemente, dort, wo das Land in den Ozean vordringt.',
      'around.access.title': 'Anreise & Mobilität',
      'around.access.p1': 'La Maison Brévan ist leicht zugänglich und stellt eine ideale Basis dar, um das gesamte Finistère zu erkunden.',
      'around.access.p2': 'Der Bahnhof von Châteaulin, nur wenige Minuten entfernt, ermöglicht es, Quimper oder Brest zu erreichen.',
      'around.access.p3': 'Die Flughäfen Brest Bretagne und Quimper Bretagne bedienen die Region je nach Saison und erleichtern Anreisen aus Frankreich und Europa.',
      'around.conclusion.title': 'Eine Einladung, die Bretagne anders zu entdecken',
      'around.conclusion.p1': 'Ein Aufenthalt in La Maison Brévan bedeutet, einen zentralen und ruhigen Ort an der Kreuzung zwischen Meer, Natur und Kulturerbe zu wählen.',
      'around.conclusion.p2': 'Eine Adresse für jene, die die Bretagne mit Eleganz, Freiheit und Gelassenheit entdecken möchten.',
}
  };
  /**
   * Apply translations for all elements with a data-i18n attribute.
   * @param {string} lang Language code (fr, en, es, de)
   */
  function applyTranslations(lang) {
    const dict = translations[lang] || translations[defaultLang];
    // Use textContent instead of innerHTML to avoid inadvertently
    // injecting HTML into the document.  See https://gomakethings.com/
    // preventing-cross-site-scripting-attacks-when-using-innerhtml-in-vanilla-javascript/
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        // Use textContent so translations remain safe; values in the
        // dictionary contain plain text only.
        el.textContent = dict[key];
      }
    });
  }
  // Track current language and apply translations
  let currentLang = storedLang;

  function setMenuOpen(isOpen) {
    // The dropdown menu is only used on legacy pages that include
    // currentLangBtn and langMenu.  Guard against null values on
    // pages using the simplified selector.
    if (!langMenu || !currentLangBtn) return;
    const selector = langMenu.parentElement;
    selector.classList.toggle('open', isOpen);
    currentLangBtn.setAttribute('aria-expanded', String(isOpen));
    langMenu.setAttribute('aria-hidden', String(!isOpen));
  }

  // Initialize the current language and apply translations
  function initLanguage() {
    // Set the flag on the legacy currentLang button if present.
    if (currentLangBtn) {
      const img = currentLangBtn.querySelector('img');
      if (img && flagSrc[currentLang]) {
        img.src = flagSrc[currentLang];
      }
    }
    document.documentElement.lang = currentLang;
    applyTranslations(currentLang);
    // After applying translations, rewrap letters for the wave animation if the helper exists.
    if (typeof window.wrapNavLetters === 'function') {
      // Use requestAnimationFrame to schedule after DOM updates
      requestAnimationFrame(() => window.wrapNavLetters());
    }
    // Close the dropdown if it exists
    setMenuOpen(false);
  }

  initLanguage();

  // Legacy dropdown behaviour: only attach handlers if the
  // dropdown elements exist.  Otherwise use the simplified
  // always‑visible selector.
  if (currentLangBtn && langMenu) {
    // Toggle menu on current flag click
    currentLangBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = langMenu.parentElement.classList.contains('open');
      setMenuOpen(!isOpen);
    });

    // Close the menu when clicking outside
    document.addEventListener('click', (e) => {
      const selector = document.querySelector('.lang-selector');
      if (selector && !selector.contains(e.target)) {
        setMenuOpen(false);
      }
    });

    // Close the menu with Escape for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    });

    // Handle language selection from the dropdown
    langMenu.querySelectorAll('button[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang') || defaultLang;
        currentLang = lang;
        localStorage.setItem('lang', lang);
        const imgEl = currentLangBtn.querySelector('img');
        if (imgEl && flagSrc[lang]) {
          imgEl.src = flagSrc[lang];
        }
        document.documentElement.lang = lang;
        applyTranslations(lang);
        setMenuOpen(false);
      });
    });
  } else {
    // Simplified selector: the page includes buttons for each language
    // directly inside the .lang-selector container.  Bind click
    // handlers to these buttons and visually indicate the active
    // language by toggling the .active class.
    const langButtons = document.querySelectorAll('.lang-selector button[data-lang]');
    function highlightActive() {
      langButtons.forEach((btn) => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
    highlightActive();
    langButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang') || defaultLang;
        currentLang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
        applyTranslations(lang);
        highlightActive();
      });
    });
  }
});
