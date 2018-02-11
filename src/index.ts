import { fromEvent } from "rxjs/observable/fromEvent"
import lerp from "./animators/lerp"
import Animatable from "./Animatable"
import * as mouse from "./sources/mouse"
import { animationFrame } from "./sources/animationFrame"
import animation from "./animation"

export { Animatable, fromEvent, animationFrame, mouse, lerp, animation }
