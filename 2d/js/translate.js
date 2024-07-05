let langs = document.querySelector(".langs"),
link = document.querySelectorAll("a"),
platform = document.getElementById("platform"),
museum = document.getElementById("museum"),
starwars = document.getElementById("starwars"),
rubik = document.getElementById("rubik"),
book = document.getElementById("book"),
novel = document.getElementById("novel"),
paint = document.getElementById("paint"),
shooter = document.getElementById("shooter"),
chess = document.getElementById("chess"),
block = document.getElementById("block"),
telegram = document.getElementById("telegram")


link.forEach(el=>{
    el.addEventListener("click", ()=>{
         langs.querySelector(".active").classList.remove("active");
         el.classList.add("active");

         let attr = el.getAttribute("language")

         platform.textContent = data[attr].platform
         museum.textContent = data[attr].museum
         starwars.textContent = data[attr].starwars
         rubik.textContent = data[attr].rubik
         book.textContent = data[attr].book
         novel.textContent = data[attr].novel
         paint.textContent = data[attr].paint
         shooter.textContent = data[attr].shooter
         chess.textContent = data[attr].chess
         block.textContent = data[attr].block
         telegram.textContent = data[attr].telegram    })
})


let data = {
    english: {
        platform: "Developed a 2D platform game using HTML and JavaScript, featuring complex mechanics including fluid character movement, robust collision detection, rich animations, and complex gameplay strategies, diverse levels, sounds, textures,  and strategic gameplay.",
        museum: "Developed an immersive and interactive website dedicated to the Louvre Museum using JavaScript and Three.js. The project showcases advanced web technologies and creative design elements, providing users with a virtual tour experience of the museum.",
        starwars: "Developed a Star Wars-themed flight combat game using JavaScript and Three.js. The game features space battles, flying mechanics, and detailed 3D models of iconic Star Wars spacecraft.",
        rubik: "Developed a 3D Rubik's Cube simulator using Python and the Ursina 3D game engine. This project allows users to interact with a virtual Rubik's Cube, manipulate its pieces manually, and explore different solving strategies.",
        book: "Developed an interactive 3D webpage using Three.js, TWEEN.js, and Turn.js, showcasing advanced techniques in lighting, smooth animations, and dynamic content transitions. Integrated a realistic book-flipping experience with Turn.js, custom cursor effects, and particle animations to enhance user engagement and create an immersive storytelling environment.",
        novel: "Developed an interactive 3D webpage using Three.js, TWEEN.js, and Turn.js, showcasing advanced techniques in lighting, smooth animations, and dynamic content transitions. Integrated a realistic book-flipping experience with Turn.js, custom cursor effects, and particle animations to enhance user engagement and create an immersive storytelling environment.",
        paint: "Developed a feature-rich painting application using JavaScript, HTML5 Canvas, and CSS. This project provides users with a versatile digital canvas where they can create artwork using various brushes, filters, shapes, and layering capabilities.",
        shooter: "Developed a first-person shooter game using JavaScript and Three.js, featuring immersive gameplay mechanics and dynamic environments.",
        chess: "Developed a fully functional chess game using JavaScript, providing a complete implementation of all standard chess mechanics. This project offers users a seamless and engaging way to play chess against a computer or another player.",
        block: "Created a Minecraft-inspired 3D block-building web application using JavaScript and Three.js. This project allows users to place and destroy blocks within a virtual environment, offering a dynamic and interactive 3D experience.",
        telegram: "Created a Telegram bot using Python that translates messages between different languages in real-time. This project leverages the Telegram Bot API and translation APIs to provide seamless communication across language barriers within the Telegram messaging platform.",
    },
    deutsch: {
        platform: "Entwickelte ein 2D-Plattformspiel mit HTML und JavaScript, das komplexe Mechaniken wie flüssige Charakterbewegungen, robuste Kollisionserkennung, reiche Animationen und komplexe Spielstrategien, diverse Level, Sounds, Texturen und strategisches Gameplay bietet.",
        museum: "Entwickelte eine immersive und interaktive Website, die dem Louvre-Museum gewidmet ist, unter Verwendung von JavaScript und Three.js. Das Projekt zeigt fortschrittliche Webtechnologien und kreative Designelemente und bietet den Benutzern ein virtuelles Tourerlebnis des Museums.",
        starwars: "Entwickelte ein Star Wars-Themen-Flugkampfspiels unter Verwendung von JavaScript und Three.js. Das Spiel bietet Weltraumschlachten, Flugmechaniken und detaillierte 3D-Modelle ikonischer Star Wars-Raumschiffe.",
        rubik: "Entwickelte einen 3D-Rubik's Cube-Simulator mit Python und der Ursina 3D-Spiele-Engine. Dieses Projekt ermöglicht es Benutzern, mit einem virtuellen Rubik's Cube zu interagieren, seine Teile manuell zu manipulieren und verschiedene Lösungsstrategien zu erkunden.",
        book: "Entwickelte eine interaktive 3D-Webseite unter Verwendung von Three.js, TWEEN.js und Turn.js, die fortschrittliche Techniken in Beleuchtung, sanften Animationen und dynamischen Inhaltsübergängen zeigt. Integrierte ein realistisches Buchblätter-Erlebnis mit Turn.js, benutzerdefinierten Cursor-Effekten und Partikelanimationen, um die Benutzerbindung zu erhöhen und eine immersive Erzählumgebung zu schaffen.",
        novel: "Entwickelte eine interaktive 3D-Webseite unter Verwendung von Three.js, TWEEN.js und Turn.js, die fortschrittliche Techniken in Beleuchtung, sanften Animationen und dynamischen Inhaltsübergängen zeigt. Integrierte ein realistisches Buchblätter-Erlebnis mit Turn.js, benutzerdefinierten Cursor-Effekten und Partikelanimationen, um die Benutzerbindung zu erhöhen und eine immersive Erzählumgebung zu schaffen.",
        paint: "Entwickelte eine funktionsreiche Malanwendung mit JavaScript, HTML5-Canvas und CSS. Dieses Projekt bietet Benutzern eine vielseitige digitale Leinwand, auf der sie Kunstwerke mit verschiedenen Pinseln, Filtern, Formen und Schichtfähigkeiten erstellen können.",
        shooter: "Entwickelte ein Ego-Shooter-Spiel mit JavaScript und Three.js, das immersive Spielmechaniken und dynamische Umgebungen bietet.",
        chess: "Entwickelte ein vollständig funktionales Schachspiel mit JavaScript, das eine vollständige Implementierung aller Standard-Schachmechaniken bietet. Dieses Projekt bietet Benutzern eine nahtlose und ansprechende Möglichkeit, Schach gegen einen Computer oder einen anderen Spieler zu spielen.",
        block: "Erstellte eine Minecraft-inspirierte 3D-Blockbau-Webanwendung mit JavaScript und Three.js. Dieses Projekt ermöglicht es Benutzern, Blöcke in einer virtuellen Umgebung zu platzieren und zu zerstören und bietet ein dynamisches und interaktives 3D-Erlebnis.",
        telegram: "Erstellte einen Telegram-Bot mit Python, der Nachrichten in Echtzeit zwischen verschiedenen Sprachen übersetzt. Dieses Projekt nutzt die Telegram Bot API und Übersetzungs-APIs, um nahtlose Kommunikation über Sprachbarrieren hinweg innerhalb der Telegram-Messaging-Plattform zu ermöglichen.",
    
    },
    russian: {
        platform: "Разработана 2D-платформенная игра с использованием HTML и JavaScript, включающая сложные механики, такие как плавное движение персонажа, надежное обнаружение столкновений, богатая анимация и сложные игровые стратегии, разнообразные уровни, звуки, текстуры и стратегический геймплей.",
        museum: "Разработан интерактивный сайт, посвященный Лувру, с использованием JavaScript и Three.js. Проект демонстрирует передовые веб-технологии и креативные элементы дизайна, предоставляя пользователям возможность виртуального тура по музею.",
        starwars: "Разработана игра на тему Звездных войн с использованием JavaScript и Three.js. Игра включает космические сражения, механики полета и детализированные 3D-модели культовых космических кораблей Звездных войн.",
        rubik: "Разработан 3D-симулятор Кубика Рубика с использованием Python и игрового движка Ursina 3D. Этот проект позволяет пользователям взаимодействовать с виртуальным Кубиком Рубика, вручную манипулировать его частями и изучать различные стратегии решения.",
        book: "Разработана интерактивная 3D-страница с использованием Three.js, TWEEN.js и Turn.js, демонстрирующая передовые техники освещения, плавной анимации и динамических переходов контента. Интегрирован реалистичный эффект перелистывания страниц с Turn.js, пользовательскими эффектами курсора и анимациями частиц для увеличения вовлеченности пользователей и создания захватывающей повествовательной среды.",
        novel: "Разработана интерактивная 3D-страница с использованием Three.js, TWEEN.js и Turn.js, демонстрирующая передовые техники освещения, плавной анимации и динамических переходов контента. Интегрирован реалистичный эффект перелистывания страниц с Turn.js, пользовательскими эффектами курсора и анимациями частиц для увеличения вовлеченности пользователей и создания захватывающей повествовательной среды.",
        paint: "Разработано многофункциональное приложение для рисования с использованием JavaScript, HTML5 Canvas и CSS. Этот проект предоставляет пользователям универсальный цифровой холст, на котором они могут создавать произведения искусства, используя различные кисти, фильтры, формы и возможности слоев.",
        shooter: "Разработана игра-шутер от первого лица с использованием JavaScript и Three.js, включающая захватывающую механику игры и динамичные окружения.",
        chess: "Разработана полностью функциональная шахматная игра с использованием JavaScript, предоставляющая полную реализацию всех стандартных шахматных механик. Этот проект предлагает пользователям плавный и увлекательный способ играть в шахматы против компьютера или другого игрока.",
        block: "Создано веб-приложение для строительства блоков в 3D, вдохновленное Minecraft, с использованием JavaScript и Three.js. Этот проект позволяет пользователям размещать и разрушать блоки в виртуальной среде, предлагая динамичный и интерактивный 3D-опыт.",
        telegram: "Создан бот для Telegram с использованием Python, который переводит сообщения между разными языками в реальном времени. Этот проект использует Telegram Bot API и API для перевода, чтобы обеспечить беспрепятственное общение через языковые барьеры в платформе обмена сообщениями Telegram.",
    
    }
}