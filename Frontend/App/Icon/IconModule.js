class IconModule{
    constructor(){}

    static Add(Color = "black"){
        return `<svg height="100%" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 172 172" width="100%" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:vectornator="http://vectornator.io" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Untitled" vectornator:layerName="Untitled">
        <g opacity="1">
        <path d="M0 172L0 0L172 0L172 172L0 172Z" fill="none" fill-rule="evenodd" opacity="1" stroke="none"/>
        <path d="M86 6.88C42.344 6.88 6.88 42.344 6.88 86C6.88 129.656 42.344 165.12 86 165.12C129.656 165.12 165.12 129.656 165.12 86C165.12 42.344 129.656 6.88 86 6.88ZM86 13.76C125.938 13.76 158.24 46.0622 158.24 86C158.24 125.938 125.938 158.24 86 158.24C46.0622 158.24 13.76 125.938 13.76 86C13.76 46.0622 46.0622 13.76 86 13.76ZM82.56 44.72L82.56 82.56L44.72 82.56L44.72 89.44L82.56 89.44L82.56 127.28L89.44 127.28L89.44 89.44L127.28 89.44L127.28 82.56L89.44 82.56L89.44 44.72L82.56 44.72Z" fill="${Color}" fill-rule="evenodd" opacity="1" stroke="none"/>
        </g>
        </g>
        </svg>`
    }

    static LeftArrow(Color = "black"){
        return `<svg height="100%" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 172 172" width="100%" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:vectornator="http://vectornator.io" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Untitled" vectornator:layerName="Untitled">
        <g opacity="1">
        <path d="M0 172L0 0L172 0L172 172L0 172Z" fill="none" opacity="1"/>
        <path d="M96.75 150.5C96.0221 150.5 95.2943 150.276 94.6784 149.842L8.67839 88.9254C7.73007 88.2536 7.16667 87.1618 7.16667 86C7.16667 84.8382 7.73007 83.7464 8.67839 83.0745L94.6784 22.1579C95.2947 21.7273 96.0224 21.5006 96.7522 21.5C97.3153 21.4995 97.8795 21.6368 98.3947 21.8989C99.5845 22.5148 100.333 23.7466 100.333 25.0833L100.333 57.3333L157.667 57.3333C161.617 57.3333 164.833 60.5457 164.833 64.5L164.833 107.5C164.833 111.454 161.617 114.667 157.667 114.667L100.333 114.667L100.333 146.917C100.333 148.253 99.5845 149.485 98.3947 150.101C97.8768 150.367 97.3134 150.5 96.75 150.5ZM16.9508 86L93.1667 139.988L93.1667 111.083C93.1667 109.103 94.7694 107.5 96.75 107.5L157.667 107.5L157.667 64.5L96.75 64.5C94.7694 64.5 93.1667 62.8973 93.1667 60.9167L93.1667 32.0121L16.9508 86Z" fill="${Color}" opacity="1"/>
        </g>
        </g>
        </svg>`
    }
}
