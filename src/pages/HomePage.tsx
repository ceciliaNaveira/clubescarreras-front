import { Section } from '../components/Section';
import ClubImage from '../assets/entrenamiento.png';
import RaceImage from '../assets/carrera.jpg';

export const HomePage = () => {
  return (
    <>
      <Section
        title="¿Buscas dónde entrenar?"
        text="Encuentra los mejores clubes de entrenamiento en Galicia y únete a la comunidad que más te convenga."
        image={ClubImage}
        buttonText="Ver clubes"
        buttonLink="/clubs"
      />
      <Section
        title="Carreras populares en Galicia"
        text="Descubre todas las carreras populares cerca de ti y participa en la que más te motive."
        image={RaceImage}
        buttonText="Ver carreras"
        buttonLink="/races"
      />
    </>
  );
};
