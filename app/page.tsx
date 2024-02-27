"use client";
import * as S from "./styles";
import {
  Button,
  CircularProgress,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { api } from "./_services/api";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IShortUrlData } from "./_interfaces/shortData";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaCheck, FaChevronRight, FaRegCopy, FaRegEdit } from "react-icons/fa";
import { catchError } from "./_utils/catchError";

const domain = process.env.NEXT_PUBLIC_SHORT_LINK;

export default function Home() {
  const [shortLink, setShortLink] = useState<
    (IShortUrlData & { editMode?: boolean })[]
  >(
    localStorage.getItem("linkStorage")
      ? JSON.parse(localStorage.getItem("linkStorage")!)
      : []
  );
  const [loading, setLoading] = useState(false);
  const linkForm = useForm<{
    linkInput: string;
    [linkEdit: `linkEdit.${string}`]: string;
  }>({
    defaultValues: {
      linkInput: "",
    },
  });

  const media650 = useMediaQuery("(min-width:650px)");

  const getShortLink = async () => {
    try {
      setLoading(true);
      const linkInput = linkForm.getValues("linkInput");

      const alreadyAdded = shortLink.some((el) => el.fullLink === linkInput);
      if (alreadyAdded) {
        return;
      }

      const res = await api.post("/link-handler", {
        fullLink: linkInput,
      });

      const data = res.data as IShortUrlData;

      setShortLink((prev) => [...prev, data]);
    } catch (e) {
      toast.error("An error occurred when trying to shorten the URL");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (
    id: string,
    currentName: string,
    editMode?: boolean
  ) => {
    const copy = [...shortLink];
    const index = copy.findIndex((el) => el.id === id);
    if (!editMode) {
      copy[index].editMode = true;
      setShortLink(copy);
      return;
    }

    const input = linkForm.getValues(`linkEdit.${id}`);

    if (currentName === input) {
      copy[index].editMode = false;
      setShortLink(copy);
      return;
    }

    try {
      setLoading(true);
      await api.patch(`/link-handler/edit/${id}`, {
        newShortLink: input,
      });
      copy[index].shortLink = input;
      copy[index].editMode = false;
      setShortLink(copy);
      toast.success("Changed successfully!");
    } catch (e) {
      const message = catchError(e);
      if (message) {
        toast.error(message);
        return;
      }
      toast.error(e as any);
    } finally {
      copy[index].editMode = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("linkStorage", JSON.stringify(shortLink));
  }, [shortLink]);

  return (
    <main>
      <S.Navbar>
        <h2>
          Short<span>URL</span>
        </h2>
      </S.Navbar>

      <S.Container>
        <S.ShortUrl>
          <S.ShortContent>
            <S.ShortHead>
              <Controller
                control={linkForm.control}
                name="linkInput"
                render={({ field }) => (
                  <TextField
                    placeholder="https://www.google.com"
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      ".MuiInputBase-root": {
                        height: "100%",
                      },
                      fieldset: {
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      },
                    }}
                    {...field}
                  />
                )}
              />
              <Button
                sx={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  flexBasis: "25%",
                  padding: 0,
                }}
                disableElevation
                variant="contained"
                onClick={getShortLink}
                disabled={loading}
              >
                {!loading ? (
                  media650 ? (
                    "Shorten url"
                  ) : (
                    <>
                      <FaChevronRight />
                    </>
                  )
                ) : (
                  <CircularProgress />
                )}
              </Button>
            </S.ShortHead>

            <S.ShortBody>
              {shortLink.length ? (
                shortLink.map((el) => (
                  <S.LinkContainer>
                    <S.ActionsCont>
                      <div>
                        <b>
                          {domain}/
                          {el.editMode ? (
                            <input
                              {...linkForm.register(`linkEdit.${el.id}`)}
                              defaultValue={el.shortLink}
                            />
                          ) : (
                            <>{el.shortLink}</>
                          )}
                        </b>

                        <S.PcButton
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `https://${domain}/${el.shortLink}`
                            );
                            toast.success("copied successfully!");
                          }}
                        >
                          <FaRegCopy />
                        </S.PcButton>
                      </div>

                      <S.PcButton
                        onClick={() =>
                          handleEdit(el.id, el.shortLink, el.editMode)
                        }
                      >
                        {el.editMode ? <FaCheck /> : <FaRegEdit />}
                      </S.PcButton>

                      <S.MobileButton
                        color={el.editMode ? "#1E962A" : "#e08c2b"}
                        onClick={() =>
                          handleEdit(el.id, el.shortLink, el.editMode)
                        }
                      >
                        {el.editMode ? (
                          <>
                            Done <FaCheck />
                          </>
                        ) : (
                          <>
                            Edit <FaRegEdit />
                          </>
                        )}
                      </S.MobileButton>
                      <S.MobileButton
                        color="#197ad2"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://${domain}/${el.shortLink}`
                          );
                          toast.success("copied successfully!");
                        }}
                      >
                        Copy Link <FaRegCopy />
                      </S.MobileButton>
                    </S.ActionsCont>

                    <p>
                      <Image
                        src={`https://www.google.com/s2/favicons?domain=${
                          new URL(el.fullLink).host
                        }`}
                        alt="icon"
                        width={15}
                        height={15}
                      />
                      <span>{el.fullLink}</span>
                    </p>
                  </S.LinkContainer>
                ))
              ) : (
                <></>
              )}
            </S.ShortBody>
          </S.ShortContent>
        </S.ShortUrl>
      </S.Container>
    </main>
  );
}
