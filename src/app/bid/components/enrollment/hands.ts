export class Hands{
    public left_thumb: Finger;
    public left_index: Finger;
    public left_middle: Finger;
    public left_ring: Finger;
    public left_pinky: Finger;

    public right_thumb: Finger;
    public right_index: Finger;
    public right_middle: Finger;
    public right_ring: Finger;
    public right_pinky: Finger;
    
    constructor(){
        this.left_thumb = new Finger();
        this.left_thumb.name = 'Pulgar';
        this.left_thumb.canonical = 'LEFT_THUMB';
        this.left_thumb.active = false;
        this.left_thumb.show = false;
        this.left_index = new Finger();
        this.left_index.name = 'Indice';
        this.left_index.canonical = 'LEFT_INDEX';
        this.left_index.active = true;
        this.left_index.show = true;
        this.left_middle = new Finger();
        this.left_middle.name = 'Medio';
        this.left_middle.canonical = 'LEFT_MIDDLE';
        this.left_middle.active = true;
        this.left_middle.show = true;
        this.left_ring = new Finger();
        this.left_ring.name = 'Anular';
        this.left_ring.canonical = 'LEFT_RING';
        this.left_ring.active = true;
        this.left_ring.show = true;
        this.left_pinky = new Finger();
        this.left_pinky.name = 'Meñique';
        this.left_pinky.canonical = 'LEFT_LITTLE';
        this.left_pinky.active = true;
        this.left_pinky.show = true;
    
        this.right_thumb = new Finger();
        this.right_thumb.name = 'Pulgar';
        this.right_thumb.canonical = 'RIGHT_THUMB';
        this.right_thumb.active = false;
        this.right_thumb.show = false;
        this.right_index = new Finger();
        this.right_index.name = 'Indice';
        this.right_index.canonical = 'RIGHT_INDEX';
        this.right_index.active = true;
        this.right_index.show = true;
        this.right_middle = new Finger();
        this.right_middle.name = 'Medio';
        this.right_middle.canonical = 'RIGHT_MIDDLE';
        this.right_middle.active = true;
        this.right_middle.show = true;
        this.right_ring = new Finger();
        this.right_ring.name = 'Anular';
        this.right_ring.canonical = 'RIGHT_RING';
        this.right_ring.active = true;
        this.right_ring.show = true;
        this.right_pinky = new Finger();
        this.right_pinky.name = 'Meñique';
        this.right_pinky.canonical = 'RIGHT_LITTLE';
        this.right_pinky.active = true;
        this.right_pinky.show = true;
    }
}

export class Finger{
    public name: string;
    public content: any;
    public active: boolean;
    public show: boolean;
    public canonical: string;

    constructor(){
        this.active = true;
        this.show = true;
        this.name = '';
        this.content = null;
    }
}