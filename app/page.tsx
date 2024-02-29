"use client";
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
import { toast } from "react-toastify";
import { FaCheck, FaChevronRight, FaRegCopy, FaRegEdit } from "react-icons/fa";
import { catchError } from "./_utils/catchError";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./styles.module.scss"
const domain = window?.location.host;

const schema = yup
  .object({
    linkInput: yup.string().url("Must be a valid url").required("This field is required"),
  })
  .required();

export default function Home() {
  const [shortLink, setShortLink] = useState<
    (IShortUrlData & { editMode?: boolean })[]
  >(
    window?.localStorage?.getItem("linkStorage")
      ? JSON.parse(window?.localStorage?.getItem("linkStorage")!)
      : []
  );
  const [loading, setLoading] = useState(false);

  const linkForm = useForm<{
    linkInput: string;
  }>({
    defaultValues: {
      linkInput: "",
    },
    resolver: yupResolver(schema),
  });
  const linkFormErrors = linkForm.formState.errors;

  const editForm = useForm<{
    linksId: { [linkEdit: `linkEdit.${string}`]: string };
  }>({
    defaultValues: {
      linksId: {},
    },
  });
  const editFormErrors = editForm.formState.errors;

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

    const input = editForm.getValues(`linksId.linkEdit.${id}`);

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
      <nav className={styles.navBar}>
        <h2>
          Short<span>URL</span>
        </h2>
      </nav>

      <div className={styles.container}>
        <div className={styles.shortUrl}>
          <div className={styles.shortContent}>
            <div className={styles.shortHead}>
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
                onClick={linkForm.handleSubmit(getShortLink)}
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
            </div>
            <p className={styles.errorMessage}>
              {linkFormErrors.linkInput?.message}
            </p>
            <div className={styles.shortBody}>
              {shortLink.length ? (
                shortLink.map((el) => (
                  <div className={styles.linkContainer} key={el.id}>
                    <div className={styles.actionsCont}>
                      <div>
                        <b>
                          {domain}/
                          {el.editMode ? (
                            <input
                              {...editForm.register(
                                `linksId.linkEdit.${el.id}`
                              )}
                              defaultValue={el.shortLink}
                              className={styles.editInput}
                            />
                          ) : (
                            <>{el.shortLink}</>
                          )}
                        </b>
                        <button
                          className={styles.pcButton}
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `https://${domain}/${el.shortLink}`
                            );
                            toast.success("copied successfully!");
                          }}
                        >
                          <FaRegCopy />
                        </button>
                      </div>
                      <button
                        className={styles.pcButton}
                        onClick={() =>
                          handleEdit(el.id, el.shortLink, el.editMode)
                        }
                      >
                        {el.editMode ? <FaCheck /> : <FaRegEdit />}
                      </button>
                      <button
                        className={styles.mobileButton}
                        style={{ backgroundColor: el.editMode ? "#1E962A" : "#e08c2b" }}
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
                      </button>
                      <button
                        className={styles.mobileButton}
                        style={{ backgroundColor: "#197ad2" }}
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://${domain}/${el.shortLink}`
                          );
                          toast.success("copied successfully!");
                        }}
                      >
                        Copy Link <FaRegCopy />
                      </button>
                    </div>
                    <p>
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${
                          new URL(el.fullLink).host
                        }`}
                        alt="icon"
                        width={15}
                        height={15}
                      />
                      <span>{el.fullLink}</span>
                    </p>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
