--
-- PostgreSQL database dump
--

\restrict MfJBW2h4bEccMKeMkl9uwduX4i0Rl5gZ7agSc76w7ADGncgnUHZjg0Ppc4Vsljf

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

-- Started on 2025-12-21 12:23:45

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16569)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4935 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16580)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    content text NOT NULL,
    "userId" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "productId" uuid
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16618)
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description text,
    "minParticipants" integer DEFAULT 1 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16589)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    price numeric NOT NULL,
    category character varying NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    description text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16605)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4926 (class 0 OID 16580)
-- Dependencies: 216
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, content, "userId", "createdAt", "productId") FROM stdin;
\.


--
-- TOC entry 4929 (class 0 OID 16618)
-- Dependencies: 219
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (id, name, description, "minParticipants", "isActive", "createdAt", "updatedAt") FROM stdin;
276ae8e1-d185-4dd2-ae69-ae23b70f3ce2	Group A	First group	10	t	2025-12-16 08:28:47.855036	2025-12-16 08:28:47.855036
\.


--
-- TOC entry 4927 (class 0 OID 16589)
-- Dependencies: 217
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, price, category, stock, description, "createdAt", "updatedAt") FROM stdin;
0d97770b-e5e4-423e-b7d1-053aebacd2f0	big_TV	1500	Electronics	10	Electronic TV	2025-12-16 09:12:36.880046	2025-12-16 09:12:36.880046
\.


--
-- TOC entry 4928 (class 0 OID 16605)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, username, password, is_admin, "createdAt", "updatedAt") FROM stdin;
bdc6d4f7-f020-4135-a5a6-94669b5a3ab2	admin1@test.com	admin1	$2b$10$c1Gj/cv3lDd4UZ.Lx5QjhedgyrU7oWDQ.4TubPIhbzJvzmDB0vr6G	t	2025-12-15 18:20:23.024806	2025-12-15 18:20:23.024806
c539ca42-2bc7-48ec-abde-c0139714d6b0	isrel1@test.com	israel1	$2b$10$BFMneDPPpMtIZiEKZslPMuXrrx255WZDC9qSgWJMgEFLzym2AKxN6	f	2025-12-15 18:46:11.192426	2025-12-15 18:46:11.192426
\.


--
-- TOC entry 4775 (class 2606 OID 16599)
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- TOC entry 4781 (class 2606 OID 16629)
-- Name: groups PK_659d1483316afb28afd3a90646e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY (id);


--
-- TOC entry 4773 (class 2606 OID 16588)
-- Name: comments PK_8bf68bc960f2b69e818bdb90dcb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY (id);


--
-- TOC entry 4779 (class 2606 OID 16615)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 4776 (class 1259 OID 16616)
-- Name: IDX_97672ac88f789774dd47f7c8be; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON public.users USING btree (email);


--
-- TOC entry 4777 (class 1259 OID 16617)
-- Name: IDX_fe0bb3f6520ee0469504521e71; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON public.users USING btree (username);


--
-- TOC entry 4782 (class 2606 OID 16600)
-- Name: comments FK_9f8304787dd13d61bc94afd07b0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "FK_9f8304787dd13d61bc94afd07b0" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;


-- Completed on 2025-12-21 12:23:45

--
-- PostgreSQL database dump complete
--

\unrestrict MfJBW2h4bEccMKeMkl9uwduX4i0Rl5gZ7agSc76w7ADGncgnUHZjg0Ppc4Vsljf
