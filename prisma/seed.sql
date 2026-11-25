--
-- PostgreSQL database dump
--

\restrict fvCdOUKSjzJFo31T7VS4hzDVke44kc9ZT493CF1Pv4JlDQxTtecXFQr2hPBahXK

-- Dumped from database version 18.4 (Debian 18.4-1.pgdg13+1)
-- Dumped by pg_dump version 18.4 (Debian 18.4-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public.users DISABLE TRIGGER ALL;

INSERT INTO public.users (id, email, name, password, created_at, updated_at, role) VALUES ('efb5736b-1d74-4475-8888-a65910dd709f', 'motta@gmail.com', 'Paulo Motta', '12345678', '2026-07-08 13:09:51.711', '2026-07-08 13:09:51.711', 'USER');
INSERT INTO public.users (id, email, name, password, created_at, updated_at, role) VALUES ('5ef61536-0d1c-45b9-bb80-23953cf00a7f', 'motta.phenrique@gmail.com', 'Paulo Motta', '$2b$08$v7KrIpR/IVcuqOHrCRngl.XANVlhJsBL4eAQfCuMx2.nlAJxN1xKu', '2026-07-08 19:00:55.853', '2026-07-08 19:00:55.853', 'USER');
INSERT INTO public.users (id, email, name, password, created_at, updated_at, role) VALUES ('924aec8e-1a41-478c-938a-892b73376f48', 'dec-test@test.com', 'Test', '$2b$08$0scztSZ7MAZw48M9vJvaQOzgQ3neTIu2A8MXoHngsDxpztRfjw5Sq', '2026-07-13 20:15:05.602', '2026-07-13 20:15:05.602', 'USER');
INSERT INTO public.users (id, email, name, password, created_at, updated_at, role) VALUES ('3a0bf374-be11-4264-8c41-1349a875281c', 'ifprcampusivp@gmail.com', 'Campus Ivaiporã Admin', '$2b$08$3Or19ZD35fsffVfc46C3qOCTTiEzI.Ue8./OEopSdSLYvPz/GYS86', '2026-07-27 19:07:36.027', '2026-07-27 19:07:36.027', 'USER');
INSERT INTO public.users (id, email, name, password, created_at, updated_at, role) VALUES ('c110100a-bd09-45eb-8dee-299f71023b22', 'e2e-scheduler@test.local', 'Admin E2E', 'x', '2026-07-30 19:44:55.984', '2026-07-30 19:44:55.984', 'ADMIN');
INSERT INTO public.users (id, email, name, password, created_at, updated_at, role) VALUES ('51cb432a-ec91-4b88-ad30-9e60167ce687', 'teste-claude-17863@example.com', 'Teste Claude', '$2b$08$.Ap7sU9YxZdmer430KJRv.uV4ecdr.RTrvWE9STRZ8b0Zb9/6ICtu', '2026-11-25 14:41:37.939', '2026-11-25 14:41:37.939', 'USER');


ALTER TABLE public.users ENABLE TRIGGER ALL;

--
-- Data for Name: Campus; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Campus" DISABLE TRIGGER ALL;

INSERT INTO public."Campus" (id, slug, name, "createdAt", "updatedAt", "ownerId") VALUES ('290b9ebe-1d4b-4626-a482-d7b1e4fece0e', 'campus-ivaipora', 'Campus Ivaiporã', '2026-07-27 19:24:01.108', '2026-07-27 19:24:01.108', '3a0bf374-be11-4264-8c41-1349a875281c');
INSERT INTO public."Campus" (id, slug, name, "createdAt", "updatedAt", "ownerId") VALUES ('c2e7e81b-e84e-4c7e-9db6-25044e3b81e3', 'e2e-campus', 'Campus Teste', '2026-07-30 19:44:55.998', '2026-07-30 19:44:55.998', 'c110100a-bd09-45eb-8dee-299f71023b22');
INSERT INTO public."Campus" (id, slug, name, "createdAt", "updatedAt", "ownerId") VALUES ('4b3e7a16-823e-4d06-b556-b679280698a3', 'campus-ivaipora', 'Campus Ivaiporã', '2026-11-25 13:33:31.222', '2026-11-25 13:33:31.222', '5ef61536-0d1c-45b9-bb80-23953cf00a7f');
INSERT INTO public."Campus" (id, slug, name, "createdAt", "updatedAt", "ownerId") VALUES ('3ea91eef-2927-4b10-af3a-838f97dad4fb', 'campus-teste', 'Campus Teste', '2026-11-25 14:41:38.127', '2026-11-25 14:41:38.127', '51cb432a-ec91-4b88-ad30-9e60167ce687');


ALTER TABLE public."Campus" ENABLE TRIGGER ALL;

--
-- Data for Name: Block; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Block" DISABLE TRIGGER ALL;

INSERT INTO public."Block" (id, slug, name, "campusId", "createdAt", "updatedAt") VALUES ('b63be192-9360-45c3-8b1e-33ff10f1f53f', 'e2e-bloco', 'Bloco A', 'c2e7e81b-e84e-4c7e-9db6-25044e3b81e3', '2026-07-30 19:44:56.002', '2026-07-30 19:44:56.002');
INSERT INTO public."Block" (id, slug, name, "campusId", "createdAt", "updatedAt") VALUES ('42b1bbb1-a0bd-4133-87c5-d6ac505911ef', 'bloco-1', 'Bloco 1', '4b3e7a16-823e-4d06-b556-b679280698a3', '2026-11-25 13:39:19.839', '2026-11-25 13:39:19.839');
INSERT INTO public."Block" (id, slug, name, "campusId", "createdAt", "updatedAt") VALUES ('a9e09ef5-6221-4e9e-a7bb-8e5ebc64c946', 'bloco-teste', 'Bloco Teste', '3ea91eef-2927-4b10-af3a-838f97dad4fb', '2026-11-25 14:41:38.472', '2026-11-25 14:41:38.472');


ALTER TABLE public."Block" ENABLE TRIGGER ALL;

--
-- Data for Name: Room; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Room" DISABLE TRIGGER ALL;

INSERT INTO public."Room" (id, slug, name, "blockId", "createdAt", "updatedAt") VALUES ('298861bc-096d-4812-9f0f-387444a51c4c', 'sala-101', 'Sala 101', 'b63be192-9360-45c3-8b1e-33ff10f1f53f', '2026-07-30 19:44:56.007', '2026-07-30 19:44:56.007');
INSERT INTO public."Room" (id, slug, name, "blockId", "createdAt", "updatedAt") VALUES ('cd9247b2-c18a-452e-803b-0a62c427da71', 'sala-102', 'Sala 102', 'b63be192-9360-45c3-8b1e-33ff10f1f53f', '2026-07-30 19:44:56.007', '2026-07-30 19:44:56.007');
INSERT INTO public."Room" (id, slug, name, "blockId", "createdAt", "updatedAt") VALUES ('f67e9905-0fda-442c-92a8-2f7a60f38a7b', 'sala-103', 'Sala 103', 'b63be192-9360-45c3-8b1e-33ff10f1f53f', '2026-07-30 19:44:56.007', '2026-07-30 19:44:56.007');
INSERT INTO public."Room" (id, slug, name, "blockId", "createdAt", "updatedAt") VALUES ('ba8ec2ff-c3c3-4399-a86a-97611c04e335', 'sala-104', 'Sala 104', 'b63be192-9360-45c3-8b1e-33ff10f1f53f', '2026-07-30 19:44:56.007', '2026-07-30 19:44:56.007');
INSERT INTO public."Room" (id, slug, name, "blockId", "createdAt", "updatedAt") VALUES ('b8a70f6e-c90a-4dd8-a06d-08375f5cea9d', 'biblioteca', 'Biblioteca', '42b1bbb1-a0bd-4133-87c5-d6ac505911ef', '2026-11-25 14:08:29.898', '2026-11-25 14:08:29.898');
INSERT INTO public."Room" (id, slug, name, "blockId", "createdAt", "updatedAt") VALUES ('f7258271-bda4-4998-8756-e7ff03c2c654', 'sala-teste', 'Sala Teste', 'a9e09ef5-6221-4e9e-a7bb-8e5ebc64c946', '2026-11-25 14:41:38.726', '2026-11-25 14:41:38.726');


ALTER TABLE public."Room" ENABLE TRIGGER ALL;

--
-- Data for Name: Controller; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Controller" DISABLE TRIGGER ALL;

INSERT INTO public."Controller" (id, slug, name, "roomId", "createdAt", "updatedAt", fan, mode, power, "swingHorizontal", "swingVertical", temp, turbo) VALUES ('a428fc87-3034-4384-a2c1-af966dd2e228', 'ar-101-b', 'Ar 101 B', '298861bc-096d-4812-9f0f-387444a51c4c', '2026-07-30 19:44:56.014', '2026-07-30 19:44:56.014', 'AUTO', 'COOL', false, false, false, 23, false);
INSERT INTO public."Controller" (id, slug, name, "roomId", "createdAt", "updatedAt", fan, mode, power, "swingHorizontal", "swingVertical", temp, turbo) VALUES ('4d7be889-bedf-4f98-a97a-341bede3366c', 'ar-101-a', 'Ar 101 A', '298861bc-096d-4812-9f0f-387444a51c4c', '2026-07-30 19:44:56.014', '2026-07-30 19:44:56.014', 'AUTO', 'COOL', false, false, false, 23, false);
INSERT INTO public."Controller" (id, slug, name, "roomId", "createdAt", "updatedAt", fan, mode, power, "swingHorizontal", "swingVertical", temp, turbo) VALUES ('d6f38696-3cca-4e1f-bb91-9b1fdf92a014', 'ar-102', 'Ar 102', 'cd9247b2-c18a-452e-803b-0a62c427da71', '2026-07-30 19:44:56.014', '2026-07-30 19:44:56.014', 'AUTO', 'COOL', false, false, false, 23, false);
INSERT INTO public."Controller" (id, slug, name, "roomId", "createdAt", "updatedAt", fan, mode, power, "swingHorizontal", "swingVertical", temp, turbo) VALUES ('127b61af-a382-4fc8-931b-d5b033463edf', 'ar-103', 'Ar 103', 'f67e9905-0fda-442c-92a8-2f7a60f38a7b', '2026-07-30 19:44:56.014', '2026-07-30 19:44:56.014', 'AUTO', 'COOL', false, false, false, 23, false);
INSERT INTO public."Controller" (id, slug, name, "roomId", "createdAt", "updatedAt", fan, mode, power, "swingHorizontal", "swingVertical", temp, turbo) VALUES ('11077464-3960-45aa-8031-e6bd220d7c9c', 'ar-104-c', 'Ar 104 C', 'ba8ec2ff-c3c3-4399-a86a-97611c04e335', '2026-07-30 19:44:56.014', '2026-07-30 19:44:56.014', 'AUTO', 'COOL', false, false, false, 23, false);
INSERT INTO public."Controller" (id, slug, name, "roomId", "createdAt", "updatedAt", fan, mode, power, "swingHorizontal", "swingVertical", temp, turbo) VALUES ('42bacd1f-e1e3-4fc8-b746-27b464ae1a67', 'ar-104-b', 'Ar 104 B', 'ba8ec2ff-c3c3-4399-a86a-97611c04e335', '2026-07-30 19:44:56.014', '2026-07-30 19:44:56.014', 'AUTO', 'COOL', false, false, false, 23, false);
INSERT INTO public."Controller" (id, slug, name, "roomId", "createdAt", "updatedAt", fan, mode, power, "swingHorizontal", "swingVertical", temp, turbo) VALUES ('dd58d95b-65bf-4363-9d88-e858691706eb', 'ar-104-a', 'Ar 104 A', 'ba8ec2ff-c3c3-4399-a86a-97611c04e335', '2026-07-30 19:44:56.014', '2026-07-30 19:44:56.014', 'AUTO', 'COOL', false, false, false, 23, false);
INSERT INTO public."Controller" (id, slug, name, "roomId", "createdAt", "updatedAt", fan, mode, power, "swingHorizontal", "swingVertical", temp, turbo) VALUES ('e693cbaf-d24a-4108-bbf6-bc441390e11e', 'ar-teste', 'Ar Teste', 'f7258271-bda4-4998-8756-e7ff03c2c654', '2026-11-25 14:41:38.981', '2026-11-25 14:41:42.532', 'AUTO', 'HEAT', false, true, false, 24, false);
INSERT INTO public."Controller" (id, slug, name, "roomId", "createdAt", "updatedAt", fan, mode, power, "swingHorizontal", "swingVertical", temp, turbo) VALUES ('4611300f-317f-44a0-b421-a796967264a5', 'ar-biblioteca', 'Ar Biblioteca', 'b8a70f6e-c90a-4dd8-a06d-08375f5cea9d', '2026-11-25 14:17:05.268', '2026-11-25 15:16:21.634', 'LOW', 'FAN', false, false, false, 21, false);


ALTER TABLE public."Controller" ENABLE TRIGGER ALL;

--
-- Data for Name: Schedule; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Schedule" DISABLE TRIGGER ALL;

INSERT INTO public."Schedule" (id, slug, name, "roomId", action, "daysOfWeek", "time", timezone, "startsAt", "endsAt", enabled, "lastRunAt", "createdById", "createdAt", "updatedAt") VALUES ('bbbc79fe-d739-49e6-8150-abb52701a7e7', 'desligar-103', 'Desligar Sala 103', 'f67e9905-0fda-442c-92a8-2f7a60f38a7b', 'TURN_OFF', '{4}', '16:57', 'America/Sao_Paulo', NULL, NULL, true, '2026-07-30 19:57:00', 'c110100a-bd09-45eb-8dee-299f71023b22', '2026-07-30 19:44:56.019', '2026-07-30 19:57:00.094');
INSERT INTO public."Schedule" (id, slug, name, "roomId", action, "daysOfWeek", "time", timezone, "startsAt", "endsAt", enabled, "lastRunAt", "createdById", "createdAt", "updatedAt") VALUES ('08214779-c351-4b53-a521-e18a118640dc', 'ligar-102', 'Ligar Sala 102', 'cd9247b2-c18a-452e-803b-0a62c427da71', 'TURN_ON', '{4}', '16:57', 'America/Sao_Paulo', NULL, NULL, true, '2026-07-30 19:57:00', 'c110100a-bd09-45eb-8dee-299f71023b22', '2026-07-30 19:44:56.019', '2026-07-30 19:57:00.124');
INSERT INTO public."Schedule" (id, slug, name, "roomId", action, "daysOfWeek", "time", timezone, "startsAt", "endsAt", enabled, "lastRunAt", "createdById", "createdAt", "updatedAt") VALUES ('8a47d287-6f4e-4baf-9277-ddab4bc62a20', 'ligar-101', 'Ligar Sala 101', '298861bc-096d-4812-9f0f-387444a51c4c', 'TURN_ON', '{4}', '16:57', 'America/Sao_Paulo', NULL, NULL, true, '2026-07-30 19:57:00', 'c110100a-bd09-45eb-8dee-299f71023b22', '2026-07-30 19:44:56.019', '2026-07-30 19:57:00.125');
INSERT INTO public."Schedule" (id, slug, name, "roomId", action, "daysOfWeek", "time", timezone, "startsAt", "endsAt", enabled, "lastRunAt", "createdById", "createdAt", "updatedAt") VALUES ('2615f403-5e74-4a11-93ed-dbfd143f0a65', 'desligar-104', 'Desligar Sala 104', 'ba8ec2ff-c3c3-4399-a86a-97611c04e335', 'TURN_OFF', '{4}', '16:57', 'America/Sao_Paulo', NULL, NULL, true, '2026-07-30 19:57:00', 'c110100a-bd09-45eb-8dee-299f71023b22', '2026-07-30 19:44:56.019', '2026-07-30 19:57:00.127');


ALTER TABLE public."Schedule" ENABLE TRIGGER ALL;

--
-- PostgreSQL database dump complete
--

\unrestrict fvCdOUKSjzJFo31T7VS4hzDVke44kc9ZT493CF1Pv4JlDQxTtecXFQr2hPBahXK

