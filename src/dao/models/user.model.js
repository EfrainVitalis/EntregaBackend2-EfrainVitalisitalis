import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    usuario: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    rol: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }
});


const UsuarioModel = mongoose.model("usuarios", userSchema);
export default UsuarioModel;
