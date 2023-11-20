import axios from "axios";
import { q, page } from "./index.js";
import Notiflix from "notiflix";

axios.defaults.baseURL = "https://pixabay.com/api/";

export async function fetchImages() {
    const PARAMS = new URLSearchParams({ key: "40771364-1b8e2f9ffde2c59ed62b20760", q: q, image_type: "photo", orientation: "horizontal", safesearch: true, page: page, per_page: 40 });
        const res = await axios.get('' + '?' + PARAMS);
        return res.data;
}