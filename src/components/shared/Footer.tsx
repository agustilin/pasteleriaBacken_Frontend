import { BiChevronRight } from "react-icons/bi"
import { Link } from 'react-router-dom';
import { socialLinks } from "../../constants/links"

export const Footer = () => {
    return (
        <footer className="py-16 bg-stone-800 px-12 flex justify-between gap-10 text-rose-100 text-sm flex-wrap mt-10 md:flex-nowrap">
            <Link to='/' className={`text-2x1 font-bold tracking-tigher transition-all text-white flex-1`}>
                <p className="text-xl my-5 hidden lg:block"> 
                    PasteleriaMilSabores
                </p>
            
                <p className="text-xs font-medium">
                    Durante años, Pastelería Mil Sabores se ha consolidado como un referente en el sector de la repostería, 
                    distinguida por su inquebrantable compromiso de endulzar los momentos más significativos de nuestros clientes. 
                    Este legado de excelencia se sustenta en tres pilares fundamentales: la preservación de recetas tradicionales 
                    que garantizan un sabor auténtico e inconfundible; la selección meticulosa de ingredientes de la más alta calidad, 
                    asegurando frescura y superioridad en cada producto; y, por encima de todo, 
                    la incorporación de la dedicación y el cariño artesanal en cada etapa de nuestro proceso.
                </p>
            </Link>

                <div className="flex flex-col gap-4 flex-1">
                    <p className="font-semibold uppercase tracking-tighter">
                        Siguenos en github
                    </p>
                    <p className="text-xs font-medium">
                        Hola mundo: Easter egg
                    </p>

                    <div className="border border-white flex items-center gap-2 px-3 py-2 rounded-full">
                        <input type="email" 
                        placeholder="Correo Electronico"
                        className="pl-2  text-white w-full"/>

                        <button className="text-slate-200">
                            <BiChevronRight size={20}/>
                        </button>

                    </div>
                    <div className="flex flex-col gap-4 flex-1">
                        <p className="font-semibold uppercase tracking-tighter">
                            Politicas
                        </p>

                        <nav className="flex flex-col gap-2 text-xs font-medium">
                            <Link to='/pasteles'>Pasteles</Link>
                            <Link to='#' className="text-slate-300 hover:text-white">Politicas de privacidad</Link>
                            <Link to='#' className="text-slate-300 hover:text-white">Terminos de uso</Link>
                        </nav>
                    </div>
                </div>

                <div className="flex flex-col gap-4 flex-1">
                    <p className="font-bold uppercase tracking-tighter">
                        Siguenos 
                    </p>
                    <p className="text-xs leading-6">
                        No te pierdas lo que MilSabores tiene para ti.   
                    </p>
                    <div className="flex">
                        {
                            socialLinks.map((link) => (
                                <a key={link.id}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-slate-300 border border-gray-8000 w-full h-full py-3.5 flex items-center justify-center transition-all hover:bg-white hover:text-gray-950">
                                        {link.icon}
                                </a>
                            ))
                        }

                    </div>
                    <button className="text-slate-300 border border-gray-500 mt-5 ml-45 w-25 flex items-center justify-center hover:bg-white hover:text-gray-950">
                        <Link to="/admin" className="w-full h-full flex items-center justify-center py-3.5">
                            Administrador
                        </Link>
                    </button>
                </div>
        </footer>
    )
}