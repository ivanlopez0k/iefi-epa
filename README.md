# EPA • Calculadora Integral de Estadística y Probabilidad Aplicada

Aplicación web modular orientada al aprendizaje, cálculo y resolución paso a paso para la cátedra de **Estadística y Probabilidad Aplicada (EPA - IEFI)**.

Desarrollada con **React 19**, **TypeScript** y **CSS nativo hecho a mano** (CSS Modules + Custom Properties / Variables de diseño, sin frameworks de utilidad ni dependencias infladas).

---

## 📐 Estructura de Módulos Temáticos

1. **Análisis Combinatorio**
   - **Asistente de Decisión**: Clasificador guiado que responde las 3 preguntas clave (*¿Importa el orden? ¿Entran todos? ¿Se repiten?*) para determinar la fórmula exacta.
   - **Calculadoras con desarrollo analítico**:
     - Permutaciones simples ($P_n = n!$), con repetición ($P_n^{a,b...}$) y circulares ($PC_n = (n-1)!$).
     - Variaciones simples ($V_n^r$) y con repetición ($VR_n^r = n^r$).
     - Combinaciones simples ($C_n^r = \binom{n}{r}$) y con repetición ($CR_n^r$).
   - Botón directo para el ejercicio clásico: *6 personas en una fila de butacas ($P_6 = 720$)*.

2. **Teoría de Conjuntos**
   - Definición de Universo ($U$), Conjunto $A$ y Conjunto $B$.
   - Operaciones automáticas: Unión ($A \cup B$), Intersección ($A \cap B$), Diferencias ($A - B$ y $B - A$), Diferencia simétrica ($A \triangle B$) y Complemento ($A^c$).
   - Diagrama de Venn visual interactivo (SVG).
   - Detección automática de conjuntos **mutuamente excluyentes / disjuntos** ($A \cap B = \emptyset$).

3. **Probabilidad y Eventos**
   - Espacios muestrales ($\Omega$) y puntos muestrales equiprobables.
   - Presets incorporados de la cátedra:
     - **Caso Cooperativa**: Elección de Presidente y Secretario entre Jorge (J), Alberto (A) y Sara (S) $\to \Omega = \{JA, JS, AS, AJ, SJ, SA\}$.
     - **3 Monedas simultáneas**: $\Omega$ de 8 puntos muestrales.
     - **Dado de 6 caras**.
   - Constructor de eventos personalizados con cálculo de **Regla de Laplace**:
     $$P(E) = \frac{\text{Casos Favorables}}{\text{Casos Posibles}}$$
   - Clasificación rigurosa de eventos: *Elemental/Simple*, *Compuesto*, *Imposible ($P=0$)* y *Seguro ($P=1$)*.

4. **Estadística Descriptiva**
   - Ingreso libre de series de datos muestrales.
   - **Tabla de Distribución de Frecuencias Completa**:
     - Frecuencia absoluta ($f_i$) y acumulada ($F_i$)
     - Frecuencia relativa ($h_i$) y acumulada ($H_i$)
     - Frecuencia porcentual ($f_i\%$) y acumulada ($F_i\%$)
     - Fila de totales de comprobación ($\sum f_i = n$, $\sum h_i = 1$, $\sum \% = 100\%$)
   - **Medidas de Tendencia Central** con demostración paso a paso:
     - **Media Aritmética ($\bar{x}$)** mediante suma ponderada.
     - **Mediana ($Me$)** con ordenamiento y tratamiento explícito para $n$ par o impar.
     - **Moda ($Mo$)** con detección de series amodales, unimodales, bimodales o multimodales.
   - **Rango y Dispersión**: Mínimo, Máximo, Rango ($R$), Varianza ($s^2$) y Desvío Estándar ($s$).
   - Gráfico de barras interactivo nativo.

---

## 🛠️ Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo local
npm run dev

# Ejecutar suite de pruebas unitarias
npm test

# Compilar para producción
npm run build
```
